#!/bin/bash

if [[ $# -lt 1 ]]; then
    echo "Number of arguments supplied not correct. Call this script: \
    ./cleanup.sh {env} \
    env should be one of the networks configured in dfx.json."
    exit 1
fi

ENV=$1

if [[ $ENV == "local" ]]; then
    rm -rf .dfx
    rm -rf .azle
    rm -rf src/declarations
fi