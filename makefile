deploy app:
	cd app/ && yarn build
	firebase deploy --only hosting

run:
	firebase emulators:start --import=./dir --export-on-exit