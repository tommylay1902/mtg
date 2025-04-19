down-dev:
	docker compose -f docker-compose.dev.yml down

build-dev:
	docker compose -f docker-compose.dev.yml build --no-cache

setup-dev: build-dev
	docker compose -f docker-compose.dev.yml up -d

dev-refresh: down-dev setup-dev
