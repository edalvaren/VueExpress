# Image we are basing this on
FROM node:11.11.0

# Create app directory
#RUN mkdir -p /srv/app/hmi-server

# Path to where the app is stored
WORKDIR /usr/src/app/
# WORKDIR /users/ealvaren/source/dockerized/indy-image/Vueexpress/
#WORKDIR /srv/app/hmi-server

# Using wildcard "*" to ensure that both package.json and package-lock.json are copied
#COPY package*.json /srv/app/hmi-server/

COPY package*.json /usr/src/app/
RUN npm install
COPY . .
# Bundle apps source code
#COPY . /srv/app/hmi-server
COPY . /usr/src/app/

# Expose the port to the outside world
EXPOSE 32770

# Command to start the app
CMD [ "npm", "start" ]

