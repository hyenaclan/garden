# GARDEN

# Setup

# Log into AWS CLI as Dev Profile
```aws sso login --profile dev```
  
# Install correct version of node
```nvm use```

# Environments - DEV
## cloudfront url
```https://d2oi41qf2bcxlf.cloudfront.net/```

## lambda health url
```curl "https://e75x4uq227.execute-api.us-east-1.amazonaws.com/health"```

# Environments - PROD

## lambda health url
```curl "https://2ugomkefji.execute-api.us-east-1.amazonaws.com/health"```