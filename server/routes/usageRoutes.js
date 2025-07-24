import express from 'express';
import { tickUsage } from '../controllers/usageController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/tick').post(protect, tickUsage);

export default router;
