// /server/controllers/fetchAndAnalyzeController.js

import { scrapeTweets } from '../utils/tweetScraper.js';
import { analyzeSentiments } from '../utils/sentimentAnalysis.js';
import { getFromCache, setInCache } from '../utils/cache.js'; // Optional
import logger from '../utils/logger.js'; // Optional

export const fetchAndAnalyze = async (req, res) => {
  const { twitterId } = req.body;

  if (!twitterId) {
    return res.status(400).json({ error: 'Twitter ID is required.' });
  }

  try {
    const cacheKey = `sentiment_${twitterId}`;
    const cachedData = getFromCache ? getFromCache(cacheKey) : null;

    if (cachedData) {
      logger && logger.info(`Cache hit for Twitter ID: ${twitterId}`);
      return res.json(cachedData);
    }

    const tweets = await scrapeTweets(twitterId);

    if (!tweets.length) {
      return res.status(404).json({ error: 'No tweets found for this user.' });
    }

    const analysis = analyzeSentiments(tweets.map(tweet => tweet.content));

    const responseData = {
      tweets,
      overallSentiment: analysis.overallSentiment,
      analyzedTweets: analysis.results,
    };

    setInCache && setInCache(cacheKey, responseData);

    res.json(responseData);
  } catch (error) {
    logger && logger.error(`fetchAndAnalyze Error for Twitter ID ${twitterId}: ${error.message}`);
    res.status(500).json({ error: error.message || 'Failed to fetch and analyze tweets.' });
  }
};