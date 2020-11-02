FROM node:12.16.3

RUN useradd --user-group --create-home --shell /bin/false app &&\
  npm install --global npm@6.14.4
RUN mkdir -p client/build
RUN mkdir -p server
ENV TZ Asia/Seoul

WORKDIR /server

COPY ./client/build /client/build
COPY ./server/dist /server
COPY ./server/package.json /server
COPY ./server/package-lock.json /server

RUN npm install
RUN npm audit fix --force

CMD [ "npm", "start" ]
