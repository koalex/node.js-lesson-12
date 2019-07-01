FROM node:10.16.0

WORKDIR /usr/app
ADD . /usr/app

RUN npm install
RUN npm run bootstrap

EXPOSE 3000

CMD ["npm", "start"]