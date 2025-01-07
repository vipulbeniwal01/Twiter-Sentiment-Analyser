// /server/routes/tweetRoutes.js

import express from 'express';
import { getTweets } from '../controllers/tweetController.js';

const router = express.Router();

// Define the POST route for fetching tweets
router.post('/', getTweets);

export default router;