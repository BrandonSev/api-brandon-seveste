FROM node:slim
# Uncomment the line above if you want to use a Dockerfile instead of templateId
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json .

RUN yarn

COPY . .

EXPOSE 8000

CMD ["yarn", "dev" ]