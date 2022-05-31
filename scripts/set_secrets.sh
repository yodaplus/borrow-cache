#!/usr/bin/env bash

CREDENTIALS_JSON=$(curl -s 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS_JSON | jq -r '.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS_JSON | jq -r '.SecretAccessKey')
export AWS_SESSION_TOKEN=$(echo $CREDENTIALS_JSON | jq -r '.Token')
export AWS_DEFAULT_REGION=ap-south-1

SECRET_JSON_RESPONSE=$(aws secretsmanager get-secret-value --secret-id $AWS_SECRET_ID)

SECRET_JSON=$(echo $SECRET_JSON_RESPONSE | jq -r '.SecretString')

export VL_DB_PASSWORD=$(echo $SECRET_JSON | jq -r '.POSTGRES_PASSWORD')
