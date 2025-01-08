FROM ghcr.io/puppeteer/puppeteer:23.11.1

# Install dependencies for Google Chrome
RUN apt-get update && apt-get install -y wget gnupg unzip

# Add Google's official GPG key
RUN wget -q -O - https://dl.google.com/linux/linux_signing_key.pub | apt-key add -

# Set up the stable repository
RUN sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list'

# Install Google Chrome
RUN apt-get update && apt-get install -y google-chrome-stable

# Optional: Verify installation
RUN google-chrome-stable --version

# Continue with your existing setup
WORKDIR /server
COPY package*.json ./
RUN npm ci
RUN npm install -g npm@11.0.0
COPY . .
RUN chown -R pptruser:pptruser /server

# Expose the necessary port
EXPOSE 10000

# Define the default command
CMD ["npm", "start"]