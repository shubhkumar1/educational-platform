import express from 'express';
import { googleLogin, logout } from '../controllers/authController.js';

const router = express.Router();
router.post('/google', googleLogin);
router.post('/logout', logout);
export default router;