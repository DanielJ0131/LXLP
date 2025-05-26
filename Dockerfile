# --- Stage 1: Builder ---
# Using node 22 alpine image
# Install all dependencies and build the client
FROM node:22-alpine AS builder

#  Install ptython tools required for node-gyp used in web app for terminal
# apk add standard download manager for alpine
# no cache prevents caching so the image size stays small
RUN apk add --no-cache python3 build-base

# Setup of working directory for the app
WORKDIR /app

# Copy all the package.json and package-lock.json files to the docker
# Only re-run if these files change
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# run npm install for all the pakcage.json files
RUN npm run boom

# Copy the whole project in app directory
# check git ignore for the ignored files and folders
COPY . .

# Build the front end react
RUN cd client && npm run build && cd /app

# --- Stage 2: Runner ---
# Final, lightweight image that will run in production...
#only has essential files and runtime dependenceis
FROM node:22-alpine AS runner
# This is often Alpine-based

WORKDIR /app

# Copy the root package.json to docker
COPY --from=builder /app/package*.json /app/

# Copy an entire server backend to docker
COPY --from=builder /app/server ./server

WORKDIR /app/server

# Install build tools in the runner stage before rebuilding native modules
# These are required for node-gyp which compiles .node files
RUN apk add --no-cache python3 build-base

RUN npm install --production

RUN npm rebuild bcrypt --update-binary || true
RUN npm rebuild node-pty --update-binary || true


# Copy from builder image to runner image the dist file for react
COPY --from=builder /app/client/dist /app/client/dist

WORKDIR /app
# Change to node user created by official node.js docker image
USER node

# Expose the port the port (make it same port as the one in the website server port)
EXPOSE 5000
EXPOSE 8080


ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "render-server"]