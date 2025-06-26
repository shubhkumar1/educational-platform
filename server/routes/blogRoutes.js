import express from 'express';
import accessControl from '../middleware/accessControlMiddleware.js';
import { createBlog } from '../controllers/blogController.js'; // <-- ADD THIS IMPORT

const router = express.Router();

// --- Existing Mock Data for Reading ---
const mockBlogs = [
    { _id: '1', title: 'First Blog Post', category: 'Tech', author: 'Creator A' },
    { _id: '2', title: 'Second Blog Post', category: 'Science', author: 'Creator B' }
];

// --- ROUTES ---

// POST a new blog (for creators)
router.post('/', createBlog); // <-- ADD THIS LINE

// GET all blogs (for students)
router.get('/', accessControl, (req, res) => res.json(mockBlogs));

// GET a single blog (for students)
router.get('/:id', accessControl, (req, res) => {
    const blog = mockBlogs.find(b => b._id === req.params.id);
    if (blog) res.json(blog);
    else res.status(404).json({ message: 'Blog not found' });
});

export default router;