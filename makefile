deploy:
	yarn build
	firebase deploy --only functions