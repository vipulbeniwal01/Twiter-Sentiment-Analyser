# Use the official Puppeteer Docker image as the base
FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Set environment variables to skip Chromium download and specify the executable path
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Switch to root user to perform installations
USER root

# Install Google Chrome Stable and necessary packages
RUN apt-get update && apt-get install -y curl gnupg --no-install-recommends \
    && curl --location --silent https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /usr/share/keyrings/google-linux-signing-keyring.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-linux-signing-keyring.gpg] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Create and set the working directory
WORKDIR /server

# Copy package.json and package-lock.json with correct ownership
COPY --chown=pptruser:pptruser package*.json ./

# Switch to the non-root user
USER pptruser

# Install project dependencies with npm
RUN npm install

# Copy the rest of your application code with correct ownership
COPY --chown=pptruser:pptruser . .

# Expose the port on which your application will run
EXPOSE 10000

# Define the command to run your application
CMD ["node", "server.js"]