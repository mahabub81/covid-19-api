#!/bin/bash
#CMD cron && tail -f ${LOG_PATH}
sh /bash/cron-bash.sh api
sh /bash/cron-bash.sh db
cron
tail -f ${LOG_PATH}
