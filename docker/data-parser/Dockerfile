
FROM ubuntu:16.04
MAINTAINER mahabub@solvease.com

ARG LOG_DIR
ARG LOG_PATH
ARG FILE_WRITE_PATH
ARG ENV_DIR
ARG SRC_DIR

RUN apt-get update
RUN apt-get -y install cron


RUN apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash \
    && apt-get install nodejs -yq



RUN mkdir -p /bash
COPY ./docker/data-parser/bash /bash/
RUN chmod +x /bash/*


ADD ./docker/data-parser/cronfile /etc/cron.d/cronfile
RUN   sed -i "s|log_path|${LOG_PATH}|g" /etc/cron.d/cronfile
RUN chmod 0644 /etc/cron.d/cronfile

RUN mkdir -p ${LOG_DIR}
RUN touch ${LOG_PATH}
RUN mkdir -p ${FILE_WRITE_PATH}

RUN mkdir -p ${ENV_DIR}
WORKDIR ${ENV_DIR}
ADD ./docker/.env ./.env


RUN mkdir -p ${SRC_DIR}
WORKDIR ${SRC_DIR}
COPY ./src/ ./

RUN npm install

WORKDIR /

RUN chmod +x /bash/entrypoint.sh

CMD ["/bash/entrypoint.sh", "${LOG_PATH}"]
#CMD cron && tail -f ${LOG_PATH}

