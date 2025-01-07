// chatbot.js

import dotenv from 'dotenv';
import retry from 'async-retry';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY; // Ensure this is set in your .env file

// Initialize the Google Generative AI client with your API key
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

/**
 * Function to send a message to the chatbot, perform sentiment analysis on tweets,
 * and generate a response based on the aggregated sentiment.
 *
 * @param {string} message - The user message or question.
 * @param {Array<string>} tweets - An array of tweets for sentiment analysis.
 * @returns {Promise<string>} - The formatted response containing overall sentiment and chatbot reply.
 */
export const sendMessageToChatbot = async (message, tweets = []) => {
    try {
        // Use retry to handle transient failures
        const response = await retry(
            async (bail) => {

                const tweetContents = tweets.map(tweet => tweet.content);

                const responsePrompt = `
You are an AI chatbot that responds appropriately based on the overall sentiment of these tweets.

Tweets: "${tweetContents}"

User Message: "${message}"

Please respond in **only one concise line** that reflects the overall sentiment of the tweets. It is not mandaotory that message content is of same topis related to tweets you only have to focus on sentiments. You have to reply question in the way like you are the person who tweets that and now you have to answer this question. . Avoid using multiple sentences or line breaks. Add emoji also.

Example:
Message: "How many more kids will Elon have? 😂"
Tweets Sentiment: Positive
Response: Haha, who knows? The universe is full of mysteries. 😉
                `;

                const chatResponse = await model.generateContent(responsePrompt, {
                    temperature: 0.7, // Adjust for creativity
                    maxOutputTokens: 60, // Adjust based on desired response length
                    stopSequences: ['\n'], // Optional: Stop at newline to encourage single-line response
                });

                // Invoke the text function to get the string
                let responseText = chatResponse.response.text().trim();

                // Post-process to ensure single-line response
                responseText = responseText.replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ');

                // Optionally, remove any remaining line breaks
                responseText = responseText.replace(/[\r\n]+/g, ' ').trim();

                return responseText;
            },
            {
                retries: 3, // Number of retry attempts
                minTimeout: 1000, // Minimum wait time between retries in ms
                onRetry: (error, attempt) => {
                    console.warn(`Retry attempt ${attempt} due to error: ${error.message}`);
                },
            }
        );

        return response;
    } catch (error) {
        console.error('Failed to process the message:', error);
        throw new Error('Unable to process the message at this time. Please try again later.');
    }
};