// /src/services/api.js

import axios from 'axios';

// const API_BASE_URL = 'https://twiter-sentiment-analyser-server.onrender.com/api'
const API_BASE_URL = 'http://localhost:4000/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Fetch and Analyze Tweets
export const fetchAndAnalyze = async (twitterId) => {
    try {
        // Remove the '/api' prefix since it's already in the baseURL
        const response = await api.post('/fetch-and-analyze', { twitterId });
        return response.data;
    } catch (error) {
        console.error('Fetch and Analyze Error:', error);
        throw error.response?.data?.error || 'An unexpected error occurred.';
    }
};

// Get Chatbot Reply
export const getChatbotReply = async (message, tweets, twitterId) => {
    try {
        // Remove the '/api' prefix since it's already in the baseURL
        const response = await api.post('/chatbot', { message, tweets });
        return response.data.reply;
    } catch (error) {
        console.error('Chatbot Reply Error:', error);
        throw error.response?.data?.error || 'An unexpected error occurred.';
    }
};

// Add error interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.response) {
            console.error('Response Data:', error.response.data);
            console.error('Response Status:', error.response.status);
        }
        return Promise.reject(error);
    }
);

export default api;
