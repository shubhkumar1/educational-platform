import Blog from '../models/Blog.js';
import slugify from 'slugify';
import mongoose from 'mongoose';

/**
 * @desc    Create a new blog post
 * @route   POST /api/blogs
 * @access  Private (Creator)
 */
export const createBlog = async (req, res) => {
    const authorId = req.user._id;
    try {
        const { title, content, category, status, coverImage } = req.body;

        // Generate a URL-friendly slug from the title
        const slug = slugify(title, { lower: true, strict: true });


        const blog = await Blog.create({
            title,
            slug,
            content,
            category,
            status,
            coverImage,
            author: authorId
        });
        res.status(201).json(blog);
    } catch (error) {
        // Handle cases where a blog with the same title (and thus slug) already exists
        if (error.code === 11000) {
            return res.status(400).json({ message: 'A blog with this title already exists.' });
        }
        res.status(500).json({ message: 'Server error while creating blog post.' });
    }
};

/**
 * @desc    Get all published blog posts
 * @route   GET /api/blogs
 * @access  Private (Authenticated Users)
 */
export const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ status: 'published' }).populate('author', 'name').sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get a single blog post by its slug (for public viewing)
 * @route   GET /api/blogs/:slug
 * @access  Private (Authenticated Users with subscription access)
 */
export const getBlogBySlug = async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            { slug: req.params.slug },
            { $inc: { views: 1 } },
            { new: true }
        ).populate('author', 'name');

        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get a single blog post by ID for editing (for the owner)
 * @route   GET /api/blogs/manage/:id
 * @access  Private (Creator only)
 */
export const getBlogForEdit = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) {
            return res.status(404).json({ message: 'Blog not found' });
        }
        // Authorization check: Ensure only the owner can fetch the content for editing
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Update a blog post
 * @route   PUT /api/blogs/manage/:id
 * @access  Private (Creator only)
 */
export const updateBlog = async (req, res) => {
    try {
        const { title, content, category, status, coverImage } = req.body; // <-- include coverImage
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.category = category || blog.category;
        blog.status = status || blog.status;
        if (coverImage) {
            blog.coverImage = coverImage; // <-- update coverImage if provided
        }

        // If the title changes, or if an old post has no slug, generate one.
        if (title || !blog.slug) {
            blog.slug = slugify(blog.title, { lower: true, strict: true });
        }

        const updatedBlog = await blog.save();
        res.json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a blog post
 * @route   DELETE /api/blogs/manage/:id
 * @access  Private (Creator only)
 */
export const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await blog.deleteOne();
        res.json({ message: 'Blog removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};