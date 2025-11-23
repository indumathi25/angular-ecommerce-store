# Makefile for Assessment-Indu

install:
	cd frontend && npm install

start:
	cd frontend && npm start

build:
	cd frontend && npm run build

test:
	cd frontend && npm test

lint:
	cd frontend && npm run lint

docker-up:
	docker-compose up --build

docker-down:
	docker-compose down

clean:
	rm -rf frontend/dist
