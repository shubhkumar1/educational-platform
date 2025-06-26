import express from 'express';
import { tickUsage } from '../controllers/usageController.js';

const router = express.Router();
router.post('/tick', tickUsage);
export default router;