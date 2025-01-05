#!/bin/bash
# set -e
# set -x

# # Vitest
# yarn test

# # Start yarn dev in the background and redirect output to a log file
# yarn dev > yarn-dev.log 2>&1 &

# # Wait for the server to be up and running
# timeout=5
# while ! curl -s http://localhost:5173 > /dev/null; do
#   timeout=$((timeout - 1))
#   if [ $timeout -le 0 ]; then
#     echo "yarn dev did not start in time"
#     exit 1
#   fi
#   sleep 1
# done


# Run Playwright tests
# yarn playwright install
# CI=true yarn run playwright test --fully-parallel --workers 4
