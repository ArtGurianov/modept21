
#!/bin/sh

set -o errexit

# Note: migrations are already should be created before running the container
yarn typeorm migration:run

[ "$NODE_ENV" = "development" ] && yarn start:debug #or :watch
[ "$NODE_ENV" = "production" ] || [ "$NODE_ENV" = "staging" ] && yarn start:prod
