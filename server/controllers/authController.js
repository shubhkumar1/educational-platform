import User from '../models/User.js';
import Session from '../models/Session.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library'; // <-- ADD THIS IMPORT

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- Initialize the client
const MAX_SESSIONS = 2;

export const googleLogin = async (req, res, next) => {
    const { googleToken, deviceId } = req.body;

    try {
        // --- STEP 1: VERIFY REAL GOOGLE TOKEN ---
        // This replaces the mockPayload. It securely verifies the token with Google.
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // --- STEP 2: FIND OR CREATE USER WITH REAL DATA ---
        // We now use the real 'payload' from Google instead of 'mockPayload'.
        let user = await User.findOne({ googleId: payload.sub });

        if (!user) {
            user = await User.create({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
            });
            console.log('New user created:', payload.email);
        } else {
            console.log('Returning user found:', payload.email);
        }
        
        // --- STEP 3: SESSION MANAGEMENT (no changes needed here) ---
        const activeSessions = await Session.find({ userId: user._id, isActive: true }).sort({ lastLogin: 'asc' });
        if (activeSessions.length >= MAX_SESSIONS) {
            const oldestSession = activeSessions[0];
            await Session.findByIdAndUpdate(oldestSession._id, { isActive: false });
        }
        await Session.create({
            userId: user._id,
            deviceId: deviceId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // --- STEP 4: GENERATE TOKEN & SEND RESPONSE (no changes needed here) ---
        generateToken(res, user._id);

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileCompleted: user.profileCompleted,
        });

    } catch (error) {
        console.error("Authentication Error:", error);
        res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
};

export const logout = async (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logout successful." });
};

export const checkAuthStatus = async (req, res) => {
    // The 'protect' middleware has already run and attached the user to 'req.user'.
    // If the middleware passed, it means the user has a valid token.
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        profileCompleted: req.user.profileCompleted,
    });
};