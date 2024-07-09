#!/bin/bash

# Function to display a menu and get the user's choice using whiptail
function select_options {
  local title="$1"
  local prompt="$2"
  shift 2
  local options=("$@")
  local choices
  choices=$(whiptail --title "$title" --separate-output --checklist "$prompt" 25 78 15 "${options[@]}" 3>&1 1>&2 2>&3)
  echo "$choices"
}

# Read aliases from .firebaserc
if [ ! -f .firebaserc ]; then
  echo ".firebaserc file not found!"
  exit 1
fi

# Select Firebase project alias
aliases=($(jq -r '.projects | keys[]' .firebaserc))
alias_list=()
for alias in "${aliases[@]}"; do
  alias_list+=("$alias" "")
done

selected_alias=$(whiptail --title "Select Firebase Project Alias" --menu "Choose an alias" 15 60 4 "${alias_list[@]}" 3>&1 1>&2 2>&3)

if [ -n "$selected_alias" ]; then
  echo "You selected $selected_alias"
else
  echo "No alias selected, exiting."
  exit 1
fi

export ENV_ALIAS="$selected_alias"

# Find firebase.json files and extract deployable items
options=()
while IFS= read -r -d '' file; do
  dir=$(dirname "$file")
  
  if [ "$dir" != "." ]; then  # Exclude root firebase.json
    # Extract functions
    functions=$(jq -r '.functions // empty | if type == "array" then .[] else . end | "Functions:" + (.friendlyName // .codebase // "unknown") + "\t" + "Deploy function from '"$dir"'"' "$file" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$functions" ]; then
      while IFS=$'\t' read -r name description; do
        [ -n "$name" ] && options+=("$dir|$name" "$description" OFF)
      done <<< "$functions"
    fi

    # Extract hosting
    hostings=$(jq -r '.hosting // empty | if type == "array" then .[] else . end | "Hosting:" + (.friendlyName // .site // "default") + "\t" + "Deploy hosting from '"$dir"'"' "$file" 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$hostings" ]; then
      while IFS=$'\t' read -r name description; do
        [ -n "$name" ] && options+=("$dir|$name" "$description" OFF)
      done <<< "$hostings"
    fi

    # Check for Firestore
    if jq -e '.firestore' "$file" > /dev/null 2>&1; then
      options+=("$dir|Firestore" "Deploy Firestore rules and indexes from $dir" OFF)
    fi
  fi
done < <(find . -name firebase.json -print0)

# Display deployment options using whiptail
selected_options=$(select_options "Deployment Options" "Choose options to deploy (use space to toggle, enter to confirm)" "${options[@]}")

# Check if user cancelled
if [ $? -ne 0 ]; then
  echo "Selection cancelled. Exiting."
  exit 1
fi

# Execute selected deployments
while IFS= read -r opt; do
  name=$(echo "$opt" | awk -F'|' '{print $2}')
  dir=$(echo "$opt" | awk -F'|' '{print $1}')
  
  cd "$dir" || continue
  
  case "$name" in
    Functions:*)
      function_name=${name#Functions:}
      codebase=$(jq -r --arg fn "$function_name" '.functions[] | select((.friendlyName // .codebase) == $fn) | .codebase' firebase.json)
      echo "Deploying function: $function_name (codebase: $codebase) from $dir"
      npx firebase deploy --only "functions:$codebase" --project "$selected_alias"
      ;;
    Hosting:*)
      hosting_name=${name#Hosting:}
      site=$(jq -r --arg hn "$hosting_name" '.hosting[] | select((.friendlyName // .site // "default") == $hn) | .site' firebase.json)
      echo "Deploying hosting: $hosting_name (site: $site) from $dir"
      npx firebase deploy --only "hosting:$site" --project "$selected_alias"
      ;;
    Firestore)
      echo "Deploying Firestore rules and indexes from $dir"
      npx firebase deploy --only firestore --project "$selected_alias"
      ;;
  esac
  
  cd - > /dev/null
done <<< "$selected_options"

echo "Deployment complete."
