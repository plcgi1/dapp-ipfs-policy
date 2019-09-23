FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

COPY package.json ./
RUN ls -la
COPY truffle-config.js ./
COPY migrations ./
COPY src ./
COPY contracts ./

# install truffle
RUN npm install

# deploy smart-contracts  to ganache docker container
# RUN npm run deploy:ganache

RUN mkdir /app/client

COPY client/package.json /app/client
COPY client/config-overrides.js /app/client
COPY client/src/ /app/client/src
COPY client/public/ /app/client/public

EXPOSE 3000:3000

# RUN cd client && npm install

#FROM nginx
#
## Add the Nginx configuration file
#ADD client/nginx.conf /etc/nginx/nginx.conf
#
## Copy over static assets from the client application
#COPY client/build /usr/share/nginx/html