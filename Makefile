start-db:
	@docker-compose up -d postgres
.PHONY: start-db

migrate:
	@docker-compose up migrate
.PHONY: migrate

seed:
	@docker-compose up seed
.PHONY: seed

setup-db: start-db migrate seed
.PHONY: setup-db

start-redis:
	@docker-compose up -d redis
.PHONY: start-redis

start-mongo:
	@docker-compose up -d mongo
.PHONY: start-mongo

setup-all: setup-db start-redis start-mongo
.PHONY: setup-all

gympoint-backend:
	@docker-compose up gympoint-backend
.PHONY: gympoint-backend

gympoint-queue:
	@docker-compose up gympoint-queue
.PHONY: gympoint-queue
