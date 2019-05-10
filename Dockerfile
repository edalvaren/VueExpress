# Image we are basing this on
FROM node:11.11.0

# Create app directory
#RUN mkdir -p /srv/app/hmi-server

# Path to where the app is stored
WORKDIR /app
# WORKDIR /users/ealvaren/source/dockerized/indy-image/Vueexpress/
#WORKDIR /srv/app/hmi-server

# Using wildcard "*" to ensure that both package.json and package-lock.json are copied
#COPY package*.json /srv/app/hmi-server/

COPY package*.json /app
RUN npm install
COPY . /app
# Bundle apps source code
#COPY . /srv/app/hmi-server
COPY . .


# Command to start the app
CMD [ "npm", "start" ]

# Expose the port to the outside world
EXPOSE 8081
