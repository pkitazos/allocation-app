setup-dev:
	sudo docker compose -f docker/docker-compose.yml -f docker/docker-compose.override.yml up -d

setup-prod:
	sudo docker compose -f docker/docker-compose.yml -f docker/docker-compose.prod.override.yml up -d

data:
	DATABASE_URL="postgresql://root:1234@localhost:6565/allocation-db?schema=public&connect_timeout=300" pnpm run db:populate

schema-change:
	pnpm run db:generate && DATABASE_URL="postgresql://root:1234@localhost:6565/allocation-db?schema=public&connect_timeout=300" pnpm run db:reset

credentials:
ifdef ID
	pnpm run credentials | grep -A1 "$(ID)" | grep -v "$(ID)"
else
	pnpm run credentials
endif
	
