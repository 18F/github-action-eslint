FROM node:10.14.1-alpine

COPY action /action

ENTRYPOINT ["/action/entrypoint.sh"]
