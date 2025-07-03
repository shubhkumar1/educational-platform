import express from 'express';
import { getQuizzes, getQuizById, submitQuiz, createQuiz, updateQuiz, deleteQuiz, getQuizForEdit } from '../controllers/quizController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createQuiz)
    .get(getQuizzes);

// Chain the new PUT and DELETE methods to the /:id route
router.route('/:id')
    .get(getQuizById) // For students to take the quiz
    .put(protect, updateQuiz) // For creators to update their quiz
    .delete(protect, deleteQuiz); // For creators to delete their quiz

router.route('/:id/edit').get(protect, getQuizForEdit);

router.route('/:id/submit').post(protect, submitQuiz);

export default router;