import Quiz from '../models/Quiz.js';
import QuizAttempt from '../models/QuizAttempt.js';

export const createQuiz = async (req, res) => {
    const creatorId = req.user.id; // Use real creator ID from token

    try {
        const { title, description, category, questions } = req.body;

        if (!title || !questions || questions.length === 0) {
            return res.status(400).json({ message: 'Quiz must have a title and at least one question.' });
        }

        const newQuiz = await Quiz.create({
            title,
            description,
            category,
            questions,
            creatorId: creatorId,
        });

        res.status(201).json(newQuiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getQuizzes = async (req, res) => {
    try {
        const { category, subCategory, limit } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }
        if (subCategory) {
            query.subCategory = subCategory;
        }

        let quizzesQuery = Quiz.find(query)
            .select('title description category')
            .sort({ createdAt: -1 });
        
        if (limit) {
            quizzesQuery = quizzesQuery.limit(parseInt(limit));
        }

        const quizzes = await quizzesQuery;
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getQuizById = async (req, res) => {
    try {
        // Use findByIdAndUpdate with $inc to increment views by 1
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id, 
            { $inc: { views: 1 } }, 
            { new: true }
        ).select('-questions.correctAnswerIndex');

        if (!quiz) {
            return res.status(404).json({ success: false, message: `Quiz not found` });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update a quiz
// @route   PUT /api/quizzes/:id
// @access  Private (for the quiz owner)
export const updateQuiz = async (req, res) => {
    try {
        const { title, description, category, questions } = req.body;
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Authorization Check: Ensure the logged-in user is the creator of the quiz
        if (quiz.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        quiz.title = title || quiz.title;
        quiz.description = description || quiz.description;
        quiz.category = category || quiz.category;
        quiz.questions = questions || quiz.questions;

        const updatedQuiz = await quiz.save();
        res.json(updatedQuiz);

    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete a quiz
// @route   DELETE /api/quizzes/:id
// @access  Private (for the quiz owner)
export const deleteQuiz = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Authorization Check
        if (quiz.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // We also need to remove associated quiz attempts before deleting the quiz
        await QuizAttempt.deleteMany({ quizId: req.params.id });
        await quiz.deleteOne();
        
        res.json({ message: 'Quiz removed successfully' });

    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Fetch a single quiz for editing (with answers)
// @route   GET /api/quizzes/:id/edit
export const getQuizForEdit = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }
        // Authorization check
        if (quiz.creatorId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

export const submitQuiz = async (req, res) => {
    const { answers } = req.body;
    const userId = req.user._id; // Use real student ID from token

    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

        let score = 0;
        quiz.questions.forEach((question, index) => {
            if (answers[index] === question.correctAnswerIndex) score++;
        });

        const attempt = await QuizAttempt.create({
            quizId: req.params.id,
            userId: userId,
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