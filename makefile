deploy-app:
	cd app/ && yarn build
	firebase deploy --only hosting

deploy-functions:
	cd functions && yarn build
	firebase deploy --only functions

run:
	firebase emulators:start --import=./dir --export-on-exit
	