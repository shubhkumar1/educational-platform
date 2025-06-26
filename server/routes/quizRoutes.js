import express from 'express';
import { getQuizzes, getQuizById, submitQuiz } from '../controllers/quizController.js';

const router = express.Router();
router.route('/').get(getQuizzes);
router.route('/:id').get(getQuizById);
router.route('/:id/submit').post(submitQuiz);
export default router;