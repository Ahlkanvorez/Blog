#!/bin/bash

# Ensure all required files for the front and back ends are up to date.
echo "Updating packages ..."
yarn

# Combine all of the front-end .angularJS files into one file (for each site: one for the public site, one for the admin site).
echo "Conglomerating front-end javascript files ..."
gulp js

echo "Conglomerating front-end Angular2 files ..."
cd public/typescript && yarn && yarn webpack && cd ../..

# Check whether development mode is desired; the default running mode is production.
mode=$1

# Don't clobber the whole profile file, only overwrite NODE_ENV=...
if [[ -n mode && "$mode" == "-dev" ]]
then
    echo "Starting server in Development mode ..."
    if grep -q "NODE_ENV=production" ~/.bash_profile
    then
        perl -pi -e 's/NODE_ENV=production/NODE_ENV=development/g' ~/.bash_profile
    else
        echo export NODE_ENV=development >> ~/.bash_profile
    fi
else
    echo "Starting server in Production mode ..."
    if grep -q "NODE_ENV=development" ~/.bash_profile
    then
        perl -pi -e 's/NODE_ENV=development/NODE_ENV=production/g' ~/.bash_profile
    else
        echo export NODE_ENV=production >> ~/.bash_profile
    fi
fi

status="$(pm2 status www)"
# If the server is already running, stop it
if [[ $status == *"stopped"* ]]
then
    pm2 start ./bin/www
else
    echo "Server was already running: restarting server ..."
    pm2 restart www
fi

pm2 log www
