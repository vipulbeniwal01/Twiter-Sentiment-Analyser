// /server/controllers/chatbotController.js

import { sendMessageToChatbot } from '../utils/chatbot.js';

/**
 * Controller to handle chatbot interactions.
 * Expects 'message' and 'sentiment' in the request body.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
export const getChatbotResponse = async (req, res) => {
  const { message, tweets, twitterId } = req.body;

  // Input validation
//   if (!message || tweets === undefined) {
//     return res.status(400).json({ error: 'Both message and sentiment are required.' });
//   }

  try {
    // Get the chatbot's reply from the Gemini API
    const reply = await sendMessageToChatbot(message, tweets, twitterId);
    
    // Send the reply back to the client
    res.json({ reply });
  } catch (error) {
    console.error('Chatbot Controller Error:', error.message);
    res.status(500).json({ error: 'Failed to get chatbot response.' });
  }
};