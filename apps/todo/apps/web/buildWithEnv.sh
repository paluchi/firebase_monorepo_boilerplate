#!/bin/bash

# Function to display a menu and get the user's choice using whiptail
function select_env {
  local title="$1"
  local prompt="$2"
  shift 2
  local options=("$@")
  local choice
  choice=$(whiptail --title "$title" --menu "$prompt" 25 78 15 "${options[@]}" 3>&1 1>&2 2>&3)
  echo "$choice"
}

# Function to display a menu and get the user's choice using select as a fallback
function select_env_with_select {
  echo "Select an environment file to use for the build:"
  select choice in "$@"; do
    echo "$choice"
    break
  done
}

# Find all .env.* files
env_files=($(ls .env.* 2>/dev/null))

# Check if any .env.* files exist
if [ ${#env_files[@]} -eq 0 ]; then
  echo "No .env.* files found!"
  exit 1
fi

# If ENV_ALIAS is set, use it directly
if [ -n "$ENV_ALIAS" ]; then
  selected_env=".env.$ENV_ALIAS"
  if [[ ! " ${env_files[@]} " =~ " ${selected_env} " ]]; then
    echo "Environment file $selected_env not found!"
    exit 1
  fi
else
  # Create options array for whiptail
  options=()
  for env_file in "${env_files[@]}"; do
    options+=("$env_file" "")
  done

  # Ask user to select an environment file using whiptail or select
  if command -v whiptail > /dev/null; then
    selected_env=$(select_env "Select Environment File" "Choose an environment file to use for the build:" "${options[@]}")
  else
    selected_env=$(select_env_with_select "${env_files[@]}")
  fi

  # Check if user cancelled
  if [ -z "$selected_env" ]; then
    echo "Selection cancelled. Exiting."
    exit 1
  fi
fi

# Execute the build command with the selected environment file
echo "Using environment file: $selected_env"
npx env-cmd -f "$selected_env" react-scripts build