// /server/routes/sentimentRoutes.js

import express from 'express';
import { analyzeSentiment } from '../controllers/sentimentController.js';

const router = express.Router();

// Define the POST route for sentiment analysis
router.post('/', analyzeSentiment);

export default router;