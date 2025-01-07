// /server/controllers/sentimentController.js

import { analyzeSentiments } from '../utils/sentimentAnalysis.js';

/**
 * Controller to analyze the sentiment of provided text.
 * Expects 'text' in the request body.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const analyzeSentiment = (req, res) => {
  const { text } = req.body;

  // Input validation
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text is required and must be a string.' });
  }

  try {
    // Analyze sentiment
    const analysis = analyzeSentiments([text]);

    // Send response
    res.json({
      overallSentiment: analysis.overallSentiment,
      analyzedText: analysis.results[0],
    });
  } catch (error) {
    console.error('Sentiment Analysis Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze sentiment.' });
  }
};