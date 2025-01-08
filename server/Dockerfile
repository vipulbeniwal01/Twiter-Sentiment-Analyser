# Use the official Puppeteer Docker image as the base
FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Set environment variables to skip Chromium download and specify the executable path
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Switch to the root user to perform installations and permission changes
USER root

# Set the working directory inside the container
WORKDIR /server

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies with npm ci
RUN npm ci

# Copy the rest of your application code to the working directory
COPY . .

# Change ownership of the /server directory to the default non-root user (pptruser)
RUN chown -R pptruser:pptruser /server

# Switch back to the non-root user for security best practices
USER pptruser

# Define the command to run your application
CMD ["node", "server.js"]