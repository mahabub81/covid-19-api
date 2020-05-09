#!/bin/bash
cd $SRC_DIR
echo "Cron start at (`date +%Y/%m/%d-%H:%M:%S`)"
export $(egrep -v '^#' "/localenv/.env" | xargs)
/usr/bin/npm run db
echo "Cron end at (`date +%Y/%m/%d-%H:%M:%S`)"
