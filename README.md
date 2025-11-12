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
Place the following env var in the file.
```DATABASE_URL=postgres://postgres:postgres@localhost:5432/garden```

### 4. Use Drizzle to view database (you can also use your preferred db viewer like Beekeeper)
```npx drizzle-kit studio```

# INFRA Commands

## Log into AWS CLI as Dev Profile
```aws sso login --profile dev```

# Environments - DEV

## cloudfront url
```https://d2oi41qf2bcxlf.cloudfront.net/```

## lambda health url
```curl "https://e75x4uq227.execute-api.us-east-1.amazonaws.com/health"```

# Environments - PROD

## cloudfront url
```https://d1xlxjcnv43v88.cloudfront.net/```

## lambda health url
```curl "https://2ugomkefji.execute-api.us-east-1.amazonaws.com/health"```

# db migrations (must be run in apps/api directory)

## generate migrations
```npm run drizzle:gen```

## apply migrations
```npm run drizzle:migrate```