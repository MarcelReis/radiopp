deploy app:
	cd app/ && yarn build
	firebase deploy --only hosting