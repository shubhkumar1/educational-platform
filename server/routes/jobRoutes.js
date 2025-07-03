import express from 'express';
import { getJobs } from '../controllers/jobController.js';

const router = express.Router();

router.route('/').get(getJobs);

export default router;