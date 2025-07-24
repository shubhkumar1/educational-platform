import express from 'express';
import { googleLogin, logout, checkAuthStatus } from '../controllers/authController.js'; // <-- ADD checkAuthStatus
import protect from '../middleware/authMiddleware.js';

const router = express.Router();
router.post('/google', googleLogin);
router.post('/logout', logout);
router.get('/status', protect, checkAuthStatus); 

export default router;