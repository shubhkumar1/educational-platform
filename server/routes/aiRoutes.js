import express from 'express';
import { generateChatResponse } from '../controllers/aiController.js';

const router = express.Router();

// This route will eventually be protected by auth middleware
router.post('/chat', generateChatResponse);

export default router;