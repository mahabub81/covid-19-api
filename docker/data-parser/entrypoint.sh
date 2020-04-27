#!/bin/bash
#CMD cron && tail -f ${LOG_PATH}
sh /run.sh forced
cron
tail -f ""/covid-19/log/cron.log
