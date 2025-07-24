import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  coverImage: { type: String, required: false },
  views: { type: Number, default: 0 }, // <-- ADD THIS
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  // FIX: Added 'default: []' to ensure these are always arrays
  likes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  dislikes: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  reports: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reason: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;