#!/bin/sh

# Exit if any subcommand fails
set -e 

if [ -z "$1" ]; then
    echo "repo-token is required"
    exit 2
fi

TOKEN="$1"
shift

if [ ! -z "$1" ]; then
    cd $1
    shift
fi

# Setup node modules if needed
if [ -e node_modules/.bin/eslint ]; then
    setup=""
else
    echo "Installing node packages"
    if [ -f yarn.lock ]; then
        sh -c "yarn --non-interactive --silent --ignore-scripts --production=false"
    else
        if [ -f package-lock.json ]; then
            sh -c "NODE_ENV=development npm ci --ignore-scripts"
        else
            sh -c "NODE_ENV=development npm install --no-package-lock --ignore-scripts"
        fi
    fi
fi

if [ -z "$1" ]; then
    REST="."
else 
    REST="$@"
fi

echo "Running eslint"
sh -c "NODE_PATH=node_modules node /action/run.js '$TOKEN' '$REST'"
