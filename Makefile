setup-dev:
	docker-compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d

setup-prod:
	docker-compose -f docker/docker-compose.yml -f docker/docker-compose.prod.override.yml up -d

data:
	DATABASE_URL="postgresql://root:1234@localhost:6565/allocation-db?schema=public&connect_timeout=300" pnpm run db:populate

credentials:
	pnpm credentials