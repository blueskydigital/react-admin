.PHONY: build

build:
	@NODE_ENV=production ./node_modules/webpack/bin/webpack.js --optimize-minimize --optimize-occurence-order --optimize-dedupe --progress
	@cp -Rf build/* examples/blog/build/
	@echo "Files build/react-admin.min.css and build/react-admin.min.js updated (with minification)"

run: mock-server dev-server

dev-server:
	@API_URL=http://localhost:3000 ./node_modules/.bin/webpack-dev-server \
		--content-base examples/list_test --inline --hot --history-api-fallback

start-test-server: test-server.PID

mock-server:
	@node fake_backend/index.js &

stop-test-server: test-server.PID
	@kill `cat $<` && rm $<
