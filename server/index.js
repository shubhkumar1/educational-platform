import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import usageRoutes from './routes/usageRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; // <-- ADD THIS

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/profile', profileRoutes); // <-- ADD THIS

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on port ${PORT}`));