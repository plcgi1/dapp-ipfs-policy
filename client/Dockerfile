FROM tiangolo/node-frontend:10 as build-stage

WORKDIR /app

RUN mkdir /app/client

COPY client/package.json /app/client

RUN cd client && npm install

COPY client/config-overrides.js /app/client
COPY client/src/ /app/client/src
COPY client/public/ /app/client/public

RUN cd client && npm run build

FROM nginx

# Add the Nginx configuration file
ADD client/nginx.conf /etc/nginx/nginx.conf

# Copy over static assets from the client application
COPY client/build /usr/share/nginx/html
