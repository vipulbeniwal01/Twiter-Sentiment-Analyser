import puppeteer from 'puppeteer';

/**
 * Scrapes tweets from a user's Twitter profile.
 *
 * @param {string} twitterId - The Twitter username (handle).
 * @returns {Promise<Array>} - An array of tweet objects with content, timestamp, and URL.
 */
export const scrapeTweets = async (twitterId) => {
  const url = `https://twitter.com/${twitterId}`;
  console.log(`Navigating to URL: ${url}`);

  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode for efficiency
    // executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable', // Optional path
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/Users/vipulbeniwal/.cache/puppeteer/chrome/mac_arm-131.0.6778.204/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', // Optional path
    args: ['--no-sandbox','--disable-setuid-sandbox',],
  });

  const page = await browser.newPage();

  try {
    // Set a realistic user-agent to avoid bot detection
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.5735.110 Safari/537.36'
    );

    // Navigate to the user's Twitter page
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    console.log('Page loaded successfully.');

    const tweets = await page.evaluate(async () => {
      const tweets = [];
      let lastHeight = 0;

      while (tweets.length < 100) {
        const tweetElements = document.querySelectorAll('article');

        tweetElements.forEach(tweetElement => {
          const retweetIndicator = tweetElement.querySelector('div[aria-label*="Retweeted"]');
          const tweetTextElement = tweetElement.querySelector('div[lang]');
          const timeElement = tweetElement.querySelector('time');
          const urlElement = tweetElement.querySelector('a[href*="/status/"]');

          if (!retweetIndicator && tweetTextElement && timeElement && urlElement) {
            const tweetText = tweetTextElement.innerText;
            const timestamp = timeElement.getAttribute('datetime');
            const url = urlElement.href;

            // Add the tweet if it's unique
            if (!tweets.some(tweet => tweet.content === tweetText)) {
              tweets.push({ content: tweetText, timestamp, url });
            }
          }
        });

        // Scroll to the bottom of the page
        lastHeight = document.body.scrollHeight;
        window.scrollTo(0, lastHeight);

        // Wait for new tweets to load
        await new Promise(resolve => setTimeout(resolve, 2000));

        const newHeight = document.body.scrollHeight;
        if (newHeight === lastHeight) break; // Exit loop if no new tweets are loaded
      }

      return tweets;
    });

    console.log('Scraping completed successfully.');
    return tweets;
  } catch (error) {
    console.error('Error in scrapeTweets:', error);
    throw new Error('Failed to scrape tweets.');
  } finally {
    await browser.close();
  }
};