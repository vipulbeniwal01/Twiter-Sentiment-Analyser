// /server/controllers/tweetController.js

import { scrapeTweets } from '../utils/tweetScraper.js';
import { getFromCache, setInCache } from '../utils/cache.js'; // Optional
import logger from '../utils/logger.js'; // Optional

/**
 * Controller to fetch tweets for a given Twitter ID.
 * Expects 'twitterId' in the request body.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getTweets = async (req, res) => {
  const { twitterId } = req.body;

  // Input validation
  if (!twitterId) {
    return res.status(400).json({ error: 'Twitter ID is required.' });
  }

  try {
    // Check if the tweets are cached
    const cacheKey = `tweets_${twitterId}`;
    const cachedTweets = getFromCache(cacheKey);

    if (cachedTweets) {
      logger && logger.info(`Cache hit for tweets of Twitter ID: ${twitterId}`);
      return res.json({ tweets: cachedTweets });
    }

    // Scrape tweets
    const tweets = await scrapeTweets(twitterId);

    // Cache the tweets
    setInCache(cacheKey, tweets);

    // Send response
    res.json({ tweets });
  } catch (error) {
    logger && logger.error(`getTweets Error for Twitter ID ${twitterId}: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch tweets.' });
  }
};