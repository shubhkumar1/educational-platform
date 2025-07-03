import express from 'express';
import { scheduleStream, getUpcomingStreams, updateStream, deleteStream, getStreamById } from '../controllers/streamController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/schedule').post(protect, scheduleStream);
router.route('/').get(getUpcomingStreams);

// Add the new routes for updating and deleting a specific stream by its ID
router.route('/:id')
    .get(protect, getStreamById)
    .put(protect, updateStream)
    .delete(protect, deleteStream);


export default router;