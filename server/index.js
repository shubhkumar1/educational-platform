import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

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

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on port ${PORT}`));