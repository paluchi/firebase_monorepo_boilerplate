# Firebase project ID
PROJECT_ID := myapp-dev

# Paths
FUNCTIONS_DIR := packages/api
WEB_APP_DIR := packages/web-app
RULES_FILE := firestore.rules
INDEXES_FILE := firestore.indexes.json

.PHONY: login init deploy-functions deploy-hosting deploy-firestore deploy-all

# Login to Firebase
login:
	firebase login

# Initialize Firebase project
init:
	firebase init

# Deploy Cloud Functions
deploy-functions: firebase deploy --only functions --project $(PROJECT_ID)

# Deploy Firestore rules and indexes
deploy-firestore:
	firebase deploy --only firestore:rules --project $(PROJECT_ID)
	firebase deploy --only firestore:indexes --project $(PROJECT_ID)

# Build and deploy the web app to Firebase Hosting
deploy-hosting:
	firebase deploy --only hosting --project $(PROJECT_ID)


# Deploy all services
deploy-all: deploy-functions deploy-firestore deploy-hosting

# Run the setup script
setup:
	./setup-firebase.sh


# Start Firebase emulators
emulators-start:
	cd $(FUNCTIONS_DIR) && npm run serve

# Clean up emulator data
emulators-clean:
	rm -rf firebase-debug.log
	rm -rf firestore-debug.log
	rm -rf firestore_export
	rm -rf emulator_ui_data
