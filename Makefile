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

setup-local:
	@chmod +x scripts/setup_dev.sh
	@./scripts/setup_dev.sh

setup-infra:
	@chmod +x scripts/setup_infra.sh
	@./scripts/setup_infra.sh

deploy:
	@chmod +x scripts/deploy.sh
	@./scripts/deploy.sh

destroy:
	@chmod +x scripts/destroy.sh
	@./scripts/destroy.sh
