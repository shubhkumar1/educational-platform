import express from 'express';
import { getMyContent } from '../controllers/creatorController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/content').get(protect, getMyContent);

export default router;