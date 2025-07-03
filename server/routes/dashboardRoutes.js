import express from 'express';
import { getCreatorAnalytics } from '../controllers/dashboardController.js';
import protect from '../middleware/authMiddleware.js'; // <-- ADD THIS IMPORT

const router = express.Router();

// FIX: Added the 'protect' middleware to this route.
// This will ensure only logged-in users can access it and will make
// req.user available in the getCreatorAnalytics controller.
router.get('/creator', protect, getCreatorAnalytics);

export default router;