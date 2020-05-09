#!/bin/bash
export $(egrep -v '^#' "/localenv/.env" | xargs)
cd $SRC_DIR
echo "Cron start at (`date +%Y/%m/%d-%H:%M:%S`)"
/usr/bin/npm run $1
echo "Cron end at (`date +%Y/%m/%d-%H:%M:%S`)"
