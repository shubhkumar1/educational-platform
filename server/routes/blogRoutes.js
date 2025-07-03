import express from 'express';
import {
    createBlog,
    getBlogs,
    getBlogBySlug,
    getBlogForEdit,
    updateBlog,
    deleteBlog
} from '../controllers/blogController.js';
import protect from '../middleware/authMiddleware.js';
import accessControl from '../middleware/accessControlMiddleware.js';

const router = express.Router();

// Base route for creating a blog or getting the public list
router.route('/')
    .post(protect, createBlog)
    .get(protect, accessControl, getBlogs);

// Creator-specific route for getting a blog to edit
router.route('/:id/edit')
    .get(protect, getBlogForEdit);

// Creator-specific routes for updating or deleting a blog
router.route('/:id')
    .put(protect, updateBlog)
    .delete(protect, deleteBlog);

// Public-facing route to read a blog using its SEO-friendly slug
// This is placed last to avoid conflicts with the /:id routes.
router.route('/:slug')
    .get(protect, accessControl, getBlogBySlug);

export default router;