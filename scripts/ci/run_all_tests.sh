#!/bin/bash
#
# Script to install dependencies and bootstrap protractor to run all Closure
# tests.

# Start web server.
python scripts/http/simple_http_server.py

# Starts selenium server.
./node_modules/.bin/webdriver-manager start

# Invoke protractor to run tests.
./node_modules/.bin/protractor protractor.conf.js
