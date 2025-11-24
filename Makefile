# Makefile for Assessment-Indu

install:
	npm install

start:
	npm start

build:
	npm run build

test:
	npm test

lint:
	npm run lint

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

clean:
	rm -rf dist
