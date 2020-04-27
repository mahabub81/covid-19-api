
FROM ubuntu:latest
MAINTAINER mahabub@solvease.com

ARG GIT_URL
ARG CLONE_PATH
ARG LOG_DIR
ARG LOG_PATH
ARG FILE_WRITE_PATH
ARG ENV_DIR
ARG SRC_DIR

RUN apt-get update
RUN apt-get -y install cron
RUN apt-get -y install git

RUN apt-get install curl gnupg -yq \
    && curl -sL https://deb.nodesource.com/setup_8.x | bash \
    && apt-get install nodejs -yq



ADD ./docker/data-parser/run.sh /run.sh
RUN chmod +x /run.sh


ADD ./docker/data-parser/cronfile /etc/cron.d/cronfile
RUN   sed -i "s|log_path|${LOG_PATH}|g" /etc/cron.d/cronfile
RUN chmod 0644 /etc/cron.d/cronfile

RUN mkdir -p ${LOG_DIR}
RUN touch ${LOG_PATH}

RUN mkdir -p ${CLONE_PATH}
RUN mkdir -p ${FILE_WRITE_PATH}
RUN git clone ${GIT_URL}  ${CLONE_PATH}


RUN mkdir -p ${ENV_DIR}
WORKDIR ${ENV_DIR}
ADD ./docker/.env ./.env


RUN mkdir -p ${SRC_DIR}
WORKDIR ${SRC_DIR}
COPY ./src/ ./

RUN npm install

WORKDIR /
ADD ./docker/data-parser/entrypoint.sh /
RUN chmod +x /entrypoint.sh

CMD ["/entrypoint.sh", "${LOG_PATH}"]
#CMD cron && tail -f ${LOG_PATH}

