# Use the official Puppeteer Docker image as the base
FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Set environment variables to skip Chromium download and specify the executable path
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Switch to root user to perform installations
USER root

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install curl gnupg -y \
  && curl --location --silent https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install google-chrome-stable -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Switch back to the default non-root user
USER pptruser

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies with npm install
RUN npm install

# Copy the rest of your application code to the working directory
COPY . .

# Expose the port on which your application will run
EXPOSE 10000

# Define the command to run your application
CMD ["node", "server.js"]