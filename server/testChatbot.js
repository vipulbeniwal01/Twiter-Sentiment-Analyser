import { sendMessageToChatbot } from './utils/chatbot.js';

const userMessage = "What's your take on the latest tech trends?";
const tweets = [
    {
        id: 1, // Unique identifier for the tweet
        content: "Loving the new smartphone releases this year! 📱🚀",
        timestamp: "2025-01-06T10:15:30.000Z"
    },
    {
        id: 2,
        content: "Not sure if AI will take over our jobs anytime soon. 🤔",
        timestamp: "2025-01-06T11:20:45.000Z"
    },
    {
        id: 3,
        content: "Excited about the advancements in renewable energy! 🌞🔋",
        timestamp: "2025-01-06T12:30:15.000Z"
    }
];

sendMessageToChatbot(userMessage, tweets)
    .then(response => {
        console.log("Chatbot Response:", response);
        // Expected Output: "Chatbot Response: It's a mixed bag, but overall, the future looks bright and innovative! 😄✨"
    })
    .catch(error => {
        console.error(error.message);
    });