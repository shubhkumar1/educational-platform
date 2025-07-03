import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  coverImage: { type: String, required: false },
  views: { type: Number, default: 0 }, // <-- ADD THIS
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;