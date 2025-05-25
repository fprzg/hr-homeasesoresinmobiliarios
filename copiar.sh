#! /bin/bash
set -e

# Variables
REMOTE_USER="hxrx-haf"
REMOTE_HOST="159.223.205.6"
REMOTE_DIR="/var/www/hxrx-haf"
ENV_FILE=".env"
SYSTEMD_SERVICE="hxrx-haf.service"

rsync -avz --delete \
  --exclude 'node_modules' \
  --exclude '.git' \
  ./* \
  $REMOTE_USER@$REMOTE_HOST:$REMOTE_DIR