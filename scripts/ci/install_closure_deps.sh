#!/bin/bash

set -ex

node -v

source ~/.nvm/nvm.sh
nvm install 0.12
nvm use 0.12

nvm alias default 0.12

# Install closure compiler and linter.
cd ..
git clone https://github.com/google/closure-compiler.git
git clone https://github.com/google/closure-linter.git
cd closure-compiler
ant jar
cd ../closure-linter
python ./setup.py install --user
cd ../closure-library
# Installs node "devDependencies" found in package.json.
npm install
# Install standalone selenium.
./node_modules/.bin/webdriver-manager update

node -v
