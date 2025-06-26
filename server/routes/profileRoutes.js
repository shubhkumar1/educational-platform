import express from 'express';
import { completeProfile } from '../controllers/profileController.js';

const router = express.Router();

// Eventually, this route will be protected by the authMiddleware
router.post('/complete', completeProfile);

export default router;