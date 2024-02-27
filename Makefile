setup:
	docker-compose down && docker-compose build --no-cache && docker-compose up -d

data:
	 DATABASE_URL="postgresql://root:1234@localhost:5451/allocation-db?schema=public&connect_timeout=300" pnpm run db:populate