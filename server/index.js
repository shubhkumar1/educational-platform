import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/db.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import usageRoutes from './routes/usageRoutes.js';
import profileRoutes from './routes/profileRoutes.js'; // <-- ADD THIS
import dashboardRoutes from './routes/dashboardRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import helmet from 'helmet'; // Secures app by setting various HTTP headers
import rateLimit from 'express-rate-limit'; // Limits repeated requests to public APIs
import pino from 'pino';
import creatorRoutes from './routes/creatorRoutes.js';


const logger = pino();

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Set security HTTP headers
app.use(helmet());

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5173', // or whatever your client's port is
    credentials: true,
}));

// Body parser
app.use(express.json());

// --- FIX: Add the cookie parser middleware ---
app.use(cookieParser()); 


app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/profile', profileRoutes); // <-- ADD THIS
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/creator', creatorRoutes);

const PORT = process.env.PORT || 8080;

// app.listen(PORT, console.log(`Server running on port ${PORT}`));
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});