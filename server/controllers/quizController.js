import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

export const getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find({}).select('title description category');
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).select('-questions.correctAnswerIndex');
        if (quiz) res.json(quiz);
        else res.status(404).json({ message: 'Quiz not found' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const submitQuiz = async (req, res) => {
    const { answers } = req.body;
    const mockUserId = '60d5f1b2b3b4f8a0b4e9f8a0';

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswerIndex) score++;
        });

        const attempt = await QuizAttempt.create({
            quizId: req.params.id,
            userId: mockUserId,
            score: score,
            answers: Object.entries(answers).map(([qIndex, aIndex]) => ({
                questionIndex: Number(qIndex),
                selectedAnswerIndex: Number(aIndex),
            })),
        });

        res.status(201).json({
            attemptId: attempt._id,
            score: attempt.score,
            total: quiz.questions.length,
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};