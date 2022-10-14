# Build the fragments backend REST-API server

# Specify the base image for other Docker images
# Use node version 16.15.1
FROM node:16.17.0

# Defining metadata about the image
LABEL maintainer="Tran Quang Dung <qdtran3@myseneca.ca>"
LABEL description="Fragments node.js microservice"

# Defining environment variables
# We default to use port 8080 in our service
ENV PORT=8080

# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn

#Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Create app's working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json /app/

# Install node dependencies defined in package-lock.json
RUN npm install

# Copy src to /app/src/
COPY ./src ./src

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

# Start the container by running our server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080
