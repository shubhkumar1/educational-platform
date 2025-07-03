import Blog from '../models/Blog.js';
import Quiz from '../models/Quiz.js';
import LiveStream from '../models/LiveStream.js';

// @desc    Get all content for the logged-in creator
// @route   GET /api/creator/content
export const getMyContent = async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.user._id }).sort({ createdAt: -1 });
        const quizzes = await Quiz.find({ creatorId: req.user._id }).sort({ createdAt: -1 });
        const streams = await LiveStream.find({ creatorId: req.user._id }).sort({ scheduledTime: -1 });

        res.json({ blogs, quizzes, streams });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};