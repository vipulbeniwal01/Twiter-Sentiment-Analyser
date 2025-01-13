// utils/chatbot.js

import dotenv from 'dotenv';
import retry from 'async-retry';
import { GoogleGenerativeAI } from '@google/generative-ai';
import vader from 'vader-sentiment'; // Corrected import for vader-sentiment

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Ensure this is set in your .env file

if (!GOOGLE_API_KEY) {
    throw new Error('GOOGLE_API_KEY is not set in the environment variables.');
}

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Function to analyze the sentiment of a tweet.
 *
 * @param {string} tweetContent - The content of a single tweet for sentiment analysis.
 * @returns {string} - The analyzed tone of the tweet.
 */
const analyzeTone = (tweetContent) => {
    // Ensure the tweet content is a string
    if (typeof tweetContent !== 'string') {
        throw new Error('The tweet content must be a string');
    }

    const sentiment = vader.SentimentIntensityAnalyzer.polarity_scores(tweetContent);

    let tone = '';
    if (sentiment.compound >= 0.5) {
        tone = 'strongly positive';
    } else if (sentiment.compound >= 0.05) {
        tone = 'positive';
    } else if (sentiment.compound > -0.05) {
        tone = 'neutral';
    } else if (sentiment.compound >= -0.5) {
        tone = 'negative';
    } else {
        tone = 'strongly negative';
    }

    if (sentiment.pos > 0.6) {
        tone += ' with a cheerful tone';
    } else if (sentiment.neg > 0.6) {
        tone += ' with an intense tone of criticism';
    } else if (sentiment.neu > 0.6) {
        tone += ' with a neutral tone';
    }

    return tone;
};

/**
 * Function to determine the dominant tone from an array of tones.
 *
 * @param {Array<string>} tones - An array of tone strings.
 * @returns {string} - The dominant tone.
 */
const getDominantTone = (tones) => {
    if (!tones.length) return 'neutral';

    const toneFrequency = tones.reduce((acc, tone) => {
        acc[tone] = (acc[tone] || 0) + 1;
        return acc;
    }, {});

    // Find the tone with the highest frequency
    return Object.keys(toneFrequency).reduce((a, b) => toneFrequency[a] > toneFrequency[b] ? a : b);
};

/**
 * Function to generate a chatbot response based on the tone of the tweets and the user message.
 *
 * @param {string} message - The user message or question.
 * @param {Array<Object>} tweets - An array of tweet objects containing tweet content for sentiment analysis.
 * @param {string} twitterId - The Twitter ID associated with the tweets.
 * @returns {Promise<string>} - The chatbot response.
 */
export const sendMessageToChatbot = async (message, tweets = [], twitterId = '') => {
    try {
        // Validate inputs
        if (typeof message !== 'string') {
            throw new Error('Message must be a string.');
        }
        if (!Array.isArray(tweets)) {
            throw new Error('Tweets must be an array of objects.');
        }
        if (typeof twitterId !== 'string') {
            throw new Error('Twitter ID must be a string.');
        }

        // Extract the content from each tweet object for analysis
        const tweetContents = tweets.map(tweet => {
            if (!tweet.content || typeof tweet.content !== 'string') {
                throw new Error('Each tweet must have a string "content" property.');
            }
            return tweet.content;
        });

        // Analyze the tone of each tweet
        const tones = tweetContents.map(analyzeTone);

        // Determine the dominant tone correctly
        const dominantTone = getDominantTone(tones);

        // Construct the prompt directly with correct roles
        const responsePrompt = `
system: You are ${twitterId}, a person with the following characteristics based on their tweets:
- **Tone:** ${dominantTone}

Your goal is to engage in conversations authentically, reflecting the aforementioned traits. Always respond as ${twitterId} without revealing that you are an AI. Keep your responses concise, limited to discussing Technology, Travel, and Coffee. For example, if asked about Technology, you might say, "AI is fascinating! It reminds me of that time I tried to teach my cat to code—spoiler: it didn't work."

human: ${message}
        `.trim();

        const chatResponse = await retry(
            async () => {
                const result = await model.generateContent(responsePrompt, {
                    temperature: 0.7, // Adjust for creativity
                    maxOutputTokens: 200, // Increased tokens for more comprehensive responses
                    stopSequences: ['\nai:'] // Stop after AI's response begins
                });

                // Log the entire result for debugging
                console.log('Generative AI Response:', result);

                // Validate the response structure
                if (!result || !result.response) {
                    throw new Error('Invalid response structure from Generative AI.');
                }

                // Handle different possible structures of result.response.text
                if (typeof result.response.text === 'function') {
                    const text = await result.response.text();
                    if (typeof text !== 'string') {
                        throw new Error('The text obtained from response.text() is not a string.');
                    }
                    return text.trim();
                } else if (typeof result.response.text === 'string') {
                    return result.response.text.trim();
                } else {
                    throw new Error('Unexpected type for result.response.text');
                }
            },
            {
                retries: 3,
                minTimeout: 1000,
                onRetry: (error, attempt) => {
                    console.warn(`Retry attempt ${attempt}: ${error.message}`);
                },
            }
        );

        // Clean up the response by removing excessive whitespace and newlines
        return chatResponse.replace(/\s*\n\s*/g, ' ').trim();
    } catch (error) {
        console.error('Failed to process the message:', error);
        throw new Error('Unable to process the message at this time. Please try again later.');
    }
};