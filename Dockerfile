# Build the fragments backend REST-API server

##########################################################################
# Stage 0: Install the base dependencies
FROM node:16.18.0@sha256:6d592fdb89fccdeb880d14f30bf139b8a755f33b376f025b70e50ac5547c8ccf AS dependencies
# Defining metadata about the image
LABEL maintainer="Tran Quang Dung <qdtran3@myseneca.ca>"
LABEL description="Fragments node.js microservice"


# Defining environment variables

ENV NODE_ENV=production
# Reduce npm spam when installing within Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#loglevel
ENV NPM_CONFIG_LOGLEVEL=warn
#Disable colour when run inside Docker
# https://docs.npmjs.com/cli/v8/using-npm/config#color
ENV NPM_CONFIG_COLOR=false

# Create app's working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files into the working dir (/app)
COPY package*.json ./
# Copy src to /app/src/
COPY ./src ./src

# Install node dependencies defined in package-lock.json
RUN npm ci

# Copy our HTPASSWD file
COPY ./tests/.htpasswd ./tests/.htpasswd

##########################################################################
# Stage 1: Build the server

FROM node:16.18-alpine3.15@sha256:9598b4e253236c8003d4e4b1acde80a6ca781fc231a7e670ecc2f3183c94ea5e AS production

WORKDIR /
COPY --from=dependencies \
  /app/node_modules/ /app/ \
  /app/src/ /app/ \
  /app/package.json ./

# We default to use port 8080 in our service
ENV PORT=8080

# Start the container by running our server
CMD ["node", "src/index.js"]

# We run our service on port 8080
EXPOSE 8080
