// testScrapeTweets.js

import { scrapeTweets } from './utils/tweetScraper.js'; // Adjust the path as necessary

const testScraping = async () => {
  try {
    const twitterId = 'narendramodi'; // Replace with a valid Twitter handle
    const tweets = await scrapeTweets(twitterId);
    console.log('Scraped Tweets:', tweets);
  } catch (error) {
    console.error('Error during scraping:', error);
  }
};

testScraping();