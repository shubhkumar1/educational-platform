import Blog from '../models/Blog.js';

// @desc    Create a new blog post
// @route   POST /api/blogs
// @access  Private (for Creators)
export const createBlog = async (req, res) => {
    // In a real app, req.user would be populated by the protect middleware
    const mockCreatorId = '60d5f1b2b3b4f8a0b4e9f8a1'; // A mock ID for a creator user

    try {
        const { title, content, category, coverImage, status } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ message: 'Please provide title, content, and category.' });
        }

        const blog = await Blog.create({
            title,
            content,
            category,
            coverImage,
            status,
            author: mockCreatorId,
        });

        res.status(201).json(blog);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while creating blog post.' });
    }
};