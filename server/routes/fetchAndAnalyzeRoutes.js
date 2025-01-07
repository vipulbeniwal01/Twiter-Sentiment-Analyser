// /server/routes/fetchAndAnalyzeRoutes.js

import express from 'express';
import { fetchAndAnalyze } from '../controllers/fetchAndAnalyzeController.js';

const router = express.Router();

// Define the POST route for fetching and analyzing tweets
router.post('/', fetchAndAnalyze);

export default router;