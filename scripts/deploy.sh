#!/bin/bash

if [[ $# -lt 1 ]]; then
    echo "Number of arguments supplied not correct. Call this script: \
    ./deploy.sh {env} \
    env should be one of the networks configured in dfx.json."
    exit 1
fi

ENV=$1

if [[ $ENV == "local" ]]; then
    # Check DFX version
    version=$(dfx -V | sed 's/dfx\ //g' | sed 's/-.*$//g')
    if [[ "$version" < "0.15.2" ]]; then
        echo "dfx 0.15.2 or above required. Please do: dfx upgrade"
        exit 1
    fi
fi

bash ./scripts/cleanup.sh "$ENV"

dfx deploy internet_identity --network "$ENV"

dfx deploy myhealth_backend --network "$ENV"

dfx generate myhealth_backend

bash ./scripts/env.sh

npm run build

dfx deploy myhealth_frontend --network "$ENV"

exit 0