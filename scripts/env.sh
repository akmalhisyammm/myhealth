#!/bin/bash

iiValue=$(jq '.internet_identity.local' .dfx/local/canister_ids.json)
backendValue=$(jq '.myhealth_backend.local' .dfx/local/canister_ids.json)

iiCanisterId="NEXT_PUBLIC_CANISTER_ID_INTERNET_IDENTITY="$iiValue
backendCanisterId="NEXT_PUBLIC_CANISTER_ID_MYHEALTH_BACKEND="$backendValue
icHost="NEXT_PUBLIC_IC_HOST=http://localhost:8080"

echo "$iiCanisterId" > .env
echo "$backendCanisterId" >> .env
echo $icHost >> .env

echo "Generated .env file:"
cat .env