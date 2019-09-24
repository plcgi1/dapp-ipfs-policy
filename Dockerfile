# FROM tiangolo/node-frontend:10 as build-stage
## RUN cd client && npm install
FROM nginx

# Add the Nginx configuration file
ADD client/nginx.conf /etc/nginx/nginx.conf

# Node image
FROM node:latest

# Create code directory
RUN mkdir /app

# Set working directory
WORKDIR /app

# Install Truffle
RUN npm install -g truffle


## Copy over static assets from the client application
# COPY client/build /usr/share/nginx/html