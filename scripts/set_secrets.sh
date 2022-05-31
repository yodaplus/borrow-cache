#!/usr/bin/env bash

CREDENTIALS_JSON=$(curl -s 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI)
export AWS_ACCESS_KEY_ID=$(echo $CREDENTIALS_JSON | jq -r '.AccessKeyId')
export AWS_SECRET_ACCESS_KEY=$(echo $CREDENTIALS_JSON | jq -r '.SecretAccessKey')
export AWS_DEFAULT_REGION=ap-south-1

echo CREDENTIALS_JSON $CREDENTIALS_JSON
echo AWS_SECRET_ID $AWS_SECRET_ID

SECRET_JSON=$(aws secretsmanager get-secret-value --secret-id $AWS_SECRET_ID)

echo SECRET_JSON $SECRET_JSON

