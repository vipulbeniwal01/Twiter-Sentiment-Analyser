// /server/routes/chatbotRoutes.js

import express from 'express';
import { getChatbotResponse } from '../controllers/chatbotController.js';

const router = express.Router();

// Define the POST route for chatbot interactions
router.post('/', getChatbotResponse);

export default router;