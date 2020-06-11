FROM alpine:3.11

ENV NODE_VERSION 14.4.0

RUN mkdir -p /app/backend
WORKDIR /app/backend

COPY package.json /app/backend
COPY package-lock.json /app/backend

RUN npm install 

COPY . /app 

CMD ["node", "server" ]

EXPOSE 8888

