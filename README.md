# GARDEN

# Setup

# Install correct version of node
```nvm use```

# DEV URL
```curl "https://e75x4uq227.execute-api.us-east-1.amazonaws.com/health"```

# PROD URL
```curl "https://2ugomkefji.execute-api.us-east-1.amazonaws.com/health"```

# Commands to use later
## Replace static files for hosting react frontend
```aws s3 sync build/ s3://$(aws cloudformation describe-stacks --stack-name infra-dev --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text) --delete```

## Invalidate cloudfront cache
```aws cloudfront create-invalidation --paths "/*"```