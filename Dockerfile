FROM node:18

WORKDIR /home/app

COPY . /home/app

EXPOSE 3002

RUN npm install

CMD ["npm","run","dev"]