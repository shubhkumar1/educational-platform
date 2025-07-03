import express from 'express';
import { createPaymentOrder, paymentCallback } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order', createPaymentOrder);
router.post('/callback', paymentCallback);

export default router;