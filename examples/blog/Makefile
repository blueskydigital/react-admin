.PHONY: build

install:
	@mkdir -p build
	npm install

build: clean
	@cp ../../build/* ./build
	@NODE_ENV=production ./node_modules/.bin/webpack --progress --debug
	@echo "File build/app.js updated"

build-debug: clean
	@cp ../../build/* ./build
	./node_modules/.bin/webpack -d --progress --debug --colors
	@echo "File build/app.js debug updated"

run:
	./node_modules/.bin/webpack-dev-server --colors \
		--inline --devtool cheap-module-inline-source-map --hot \
		--content-base .

clean:
	@rm -rf ./build/*
