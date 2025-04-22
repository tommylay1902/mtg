down-dev:
	docker compose -f docker-compose.dev.yml down

build-fresh-dev:
	docker compose -f docker-compose.dev.yml build --no-cache

build-dev:
	docker compose -f docker-compose.dev.yml build

setup-fresh-dev: build-fresh-dev
	docker compose -f docker-compose.dev.yml up -d

setup-dev: build-dev
	docker compose -f docker-compose.dev.yml up -d

refresh-dev: down-dev setup-dev

refresh-fresh-dev: down-dev setup-fresh-dev
