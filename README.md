# GARDEN

# LOCAL Setup

## Install correct version of node
```nvm use```

## Local PostgreSQL Setup (Docker)

### 1. Install Docker
If you don’t have Docker installed yet:
- Download **Docker Desktop**:  
  [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

### 2. Setup a local postgres container using Docker
~~~bash
docker run --name local-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=garden \
  -p 5432:5432 \
  -d postgres:17
~~~

### 3. .env file for local dev
Create a .env file in apps/api folder. It should have all the required ENV vars for the api to run.
Place the following env vars in the file:
```
DB_HOST=localhost
DB_USER=postgres
DB_PASS=postgres
DB_NAME=garden
DB_PORT=5432
DEV_API_URL=<your-dev-api-gateway-url>
```

### 4. Use Drizzle to view database (you can also use your preferred db viewer like Beekeeper)
```npx drizzle-kit studio```

# INFRA Commands

## Log into AWS CLI as Dev Profile
```aws sso login --profile dev```

# db migrations (must be run in apps/api directory)

## generate migrations
```npm run drizzle:gen```

## apply migrations
```npm run drizzle:migrate```