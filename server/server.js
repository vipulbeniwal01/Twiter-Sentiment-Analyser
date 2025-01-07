// server/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import morgan from 'morgan';
import serverless from 'serverless-http'; // Import serverless-http

// Load environment variables
dotenv.config();

const app = express();

app.use(cors({
  origin: ['https://twiter-sentiment-analyser.vercel.app', 'http://localhost:5173'], // Set directly to localhost
  credentials: true
}));

app.use(express.json());

// Import Routes
import fetchAndAnalyzeRoutes from './routes/fetchAndAnalyzeRoutes.js';
import chatbotRoutes from './routes/chatbotRoutes.js';
import tweetRoutes from './routes/tweetRoutes.js';
import sentimentRoutes from './routes/sentimentRoutes.js';

// Use Routes
app.use('/api/fetch-and-analyze', fetchAndAnalyzeRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/api/sentiment', sentimentRoutes);

// Root Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Twitter Sentiment Analyzer API' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the serverless handler
export const handler = serverless(app);

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));