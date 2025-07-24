import User from '../models/User.js';
import Session from '../models/Session.js';
import Subscription from '../models/Subscription.js';
import generateToken from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library'; // <-- ADD THIS IMPORT

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); // <-- Initialize the client
const MAX_SESSIONS = 2;

export const googleLogin = async (req, res, next) => {
    const { googleToken, deviceId, intendedRole } = req.body;

    if (!['student', 'creator', 'admin'].includes(intendedRole)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

    try {
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        
        let user = await User.findOne({ googleId: payload.sub });

        if (!user) {
            // If the user is new, create them with the intended role
            user = await User.create({
                googleId: payload.sub,
                email: payload.email,
                name: payload.name,
                role: intendedRole, // Set the role based on the login page
                profileCompleted: false
            });

            // --- FIX: Create a default free-tier subscription for the new user ---
            await Subscription.create({
                userId: user._id,
                status: 'free_tier',
                monthlyUsageMinutes: 0
            });
            console.log(`[SERVER] Created default subscription for new user: ${user.email}`);
        } else {
            // If the user exists, check if they are logging in through the correct portal
            if (user.role !== intendedRole) {
                return res.status(403).json({ message: `This account is registered as a ${user.role}. Please log in through the correct portal.` });
            }
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
    // The 'protect' middleware should attach the user object to req.user if the token is valid.
    // We must check if req.user actually exists before trying to access its properties.
    if (req.user) {
        // If user is found, they are authenticated.
        res.status(200).json({
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role,
            profileCompleted: req.user.profileCompleted,
        });
    } else {
        // If req.user is null or undefined, it means the token was invalid, expired, or not provided.
        // This is an expected case for unauthenticated users.
        res.status(401).json({ message: 'Not authorized, token failed.' });
    }
};