import express from 'express';
import { completeProfile } from '../controllers/profileController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Eventually, this route will be protected by the authMiddleware
router.post('/complete', protect, completeProfile);

export default router;