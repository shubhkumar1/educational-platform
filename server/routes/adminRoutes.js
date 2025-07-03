import express from 'express';
import { getAdminDashboardData, createAdCampaign } from '../controllers/adminController.js';
import protect from '../middleware/authMiddleware.js'; // <-- ADD THIS
import admin from '../middleware/adminMiddleware.js'; // <-- ADD THIS

const router = express.Router();

// The 'protect' middleware runs first, then the 'admin' middleware checks the role.
router.get('/dashboard-data', protect, admin, getAdminDashboardData);
router.post('/campaigns', protect, admin, createAdCampaign);

export default router;