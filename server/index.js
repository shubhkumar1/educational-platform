import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'; 
import connectDB from './config/db.js';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import pinoHttp from 'pino-http'; // <-- ADD THIS for request logging

// Import routes
import authRoutes from './routes/authRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import usageRoutes from './routes/usageRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import streamRoutes from './routes/streamRoutes.js';
import pricingRoutes from './routes/pricingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js'; 
import aiRoutes from './routes/aiRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import creatorRoutes from './routes/creatorRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js'; // <-- IMPORT THE NEW ROUTE


// Initialize logger
const logger = pino();

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Middleware Setup ---

// Set security HTTP headers with Helmet
app.use(helmet()); 

// FIX: Set Cross-Origin policies for compatibility with popups (like Google Login)
// Note: 'unsafe-none' for COEP is safer for compatibility with third-party iframes.
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "accounts.google.com"], // Allow scripts from self and Google
    },
  })
);
app.use(
  helmet({
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
    crossOriginEmbedderPolicy: false, // Setting this to false can resolve compatibility issues
  })
);

// Rate limiting to prevent brute-force attacks
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Enable CORS
app.use(cors({
    // origin: 'http://localhost:5173', // Your client's origin
    origin: 'https://genzbro.netlify.app', // Your client's origin
    credentials: true,
    optionsSuccessStatus: 200 
}));

// Body parser middleware
app.use(express.json());

// Cookie parser middleware
app.use(cookieParser()); 

// ADD: HTTP request logger
app.use(pinoHttp({ logger }));

// --- Routes ---

app.get('/', (req, res) => {
  res.send('API is running...');
});

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/usage', usageRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/streams', streamRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/jobs', jobRoutes); 
app.use('/api/admin', adminRoutes); 
app.use('/api/creator', creatorRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    // logger.info(`Server running on port ${PORT}`);
    console.log(`Server running on port ${PORT}`);
});