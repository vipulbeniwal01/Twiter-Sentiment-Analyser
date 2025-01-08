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
    headless: 'new', // Run in headless mode
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/google-chrome-stable',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  try {
    // Set a realistic user-agent to avoid bot detection
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36');

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 0 });
    console.log('Page loaded successfully.');

    // Scroll and fetch tweets
    const tweets = await page.evaluate(async () => {
      const tweets = [];
      let lastHeight = 0;
      let currentHeight = document.body.scrollHeight;

      while (tweets.length < 60 && currentHeight !== lastHeight) {
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(resolve => setTimeout(resolve, 2000));
        lastHeight = currentHeight;
        let a = 0;
        while(a<10){
          currentHeight = document.body.scrollHeight;
        a++;
        }


        const tweetElements = document.querySelectorAll('article');

        tweetElements.forEach(tweetElement => {
          const retweetIndicator = tweetElement.querySelector('div[aria-label*="Retweeted"]');
          const tweetTextElement = tweetElement.querySelector('div[lang]');
          const timeElement = tweetElement.querySelector('time');
          const urlElement = tweetElement.querySelector('a[href*="/status/"]');

          // if (tweetTextElement && timeElement && urlElement) {
          if (!retweetIndicator && tweetTextElement && timeElement && urlElement) {
            const tweetText = tweetTextElement.innerText;
            const timestamp = timeElement.getAttribute('datetime');
            const url = urlElement.href;

            if (!tweets.some(tweet => tweet.content === tweetText) && tweets.length < 100) {
              tweets.push({ content: tweetText, timestamp, url });
            }
          }
        });

        console.log(`Fetched ${tweets.length} tweets so far.`);
      }

      return tweets;
    });

    await browser.close();
    console.log('Scraping completed successfully.');
    return tweets;
  } catch (error) {
    await browser.close();
    console.error('Error in scrapeTweets:', error);
    throw new Error('Failed to scrape tweets.');
  }
};

