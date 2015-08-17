#!/bin/bash
#
# Script to install dependencies and bootstrap protractor to run all Closure
# tests.

HTTP_PORT=8080
SELENIUM_PORT=4444

# Make sure to kill both servers on exit (e.g., CTRL+C).
trap 'fuser -k $HTTP_PORT/tcp; fuser -k $SELENIUM_PORT/tcp' EXIT

# Start web server.
python scripts/http/simple_http_server.py & sleep 5

# Starts selenium server.
./node_modules/.bin/webdriver-manager start & sleep 5

# Invoke protractor to run tests.
./node_modules/.bin/protractor protractor.conf.js
