#!/bin/bash

export $(egrep -v '^#' "/localenv/.env" | xargs)

# Started the cron
start_timestamp=`date +%Y/%m/%d-%H:%M:%S`
echo "Cron start at $start_timestamp"

update_everything() {
   cd $CLONE_PATH
    # Git pull
    /usr/bin/git pull
    ## Goto the APP directory
    cd $SRC_DIR
    ## Run the node js app
    /usr/bin/npm run parser
    /usr/bin/npm run postman
}


if [ "$1" = "forced" ]
  then
    update_everything
    echo "forced update"
fi


## Goto Git Local repo Path
cd $CLONE_PATH
git remote update
UPSTREAM='origin/master'
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "$UPSTREAM")
BASE=$(git merge-base @ "$UPSTREAM")
if [ $LOCAL = $REMOTE ]; then
    echo "Everything upto date do nothing"
elif [ $LOCAL = $BASE ]; then
   update_everything
elif [ $REMOTE = $BASE ]; then
    echo "Need to push, we cant "
else
    echo "Diverged"
fi


end_timestamp=`date +%Y/%m/%d-%H:%M:%S`
echo "Cron end  at $end_timestamp"
