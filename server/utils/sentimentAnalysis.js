// /server/utils/sentimentAnalysis.js

import Sentiment from 'sentiment';

const sentiment = new Sentiment();

/**
 * Analyzes the sentiment of an array of tweets.
 *
 * @param {Array<string>} tweets - An array of tweet texts.
 * @returns {Object} - An object containing the overall sentiment score and individual tweet analyses.
 * @throws Will throw an error if the input is not a valid array of strings.
 */
export const analyzeSentiments = (tweets) => {
  if (!tweets || !Array.isArray(tweets)) {
    throw new Error('Invalid input: tweets should be an array of strings.');
  }

  let totalScore = 0;
  const results = tweets.map((tweet) => {
    const analysis = sentiment.analyze(tweet);
    totalScore += analysis.score;
    return {
      tweet,
      score: analysis.score,
      comparative: analysis.comparative,
    };
  });

  const overallSentiment = tweets.length > 0 ? totalScore / tweets.length : 0;

  return { overallSentiment, results };
};