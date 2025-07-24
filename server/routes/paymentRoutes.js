import express from 'express';
import { createPaymentOrder, checkPaymentStatus } from '../controllers/paymentController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, createPaymentOrder);
router.post('/status', protect, checkPaymentStatus);

export default router;