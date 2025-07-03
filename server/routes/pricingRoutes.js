import express from 'express';
import { setPricing } from '../controllers/pricingController.js';
import protect from '../middleware/authMiddleware.js'; // <-- ADD THIS

const router = express.Router();

router.route('/').put(protect, setPricing); // <-- ADD MIDDLEWARE

export default router;