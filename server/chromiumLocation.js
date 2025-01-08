import puppeteer from 'puppeteer';

(async () => {
  const executablePath = puppeteer.executablePath();
  console.log('Chromium executable path:', executablePath);
})();