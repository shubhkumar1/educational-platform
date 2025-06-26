import User from '../models/User.js';
import Session from '../models/Session.js';
// We would use a library like 'google-auth-library' to verify the token
// For now, we will simulate the verification.

const MAX_SESSIONS = 2;

export const googleLogin = async (req, res) => {
    const { googleToken, deviceId } = req.body;

    try {
        // --- STEP 1: VERIFY GOOGLE TOKEN (Simulated) ---
        // In a real app, you would use a library to verify the googleToken and get the user's profile.
        // const ticket = await client.verifyIdToken({ idToken: googleToken, audience: process.env.GOOGLE_CLIENT_ID });
        // const payload = ticket.getPayload();
        // For now, we'll simulate this with mock data.
        const mockPayload = {
            sub: '123456789123456789123', // A unique Google ID
            email: 'newuser@example.com', // Let's use a new email to test
            name: 'New Test User',
        };

        // --- STEP 2: FIND OR CREATE USER ---
        // This is the new logic that handles first-time users.
        let user = await User.findOne({ googleId: mockPayload.sub });

        if (!user) {
            // If user doesn't exist, create them.
            // The `profileCompleted` flag will be false by default, as per our schema.
            user = await User.create({
                googleId: mockPayload.sub,
                email: mockPayload.email,
                name: mockPayload.name,
            });
            console.log('New user created:', user.email);
        } else {
            console.log('Returning user found:', user.email);
        }

        // --- STEP 3: HANDLE DEVICE SESSION ---
        const activeSessions = await Session.find({ userId: user._id, isActive: true }).sort({ lastLogin: 'asc' });

        if (activeSessions.length >= MAX_SESSIONS) {
            const oldestSession = activeSessions[0];
            await Session.findByIdAndUpdate(oldestSession._id, { isActive: false });
        }

        const newSession = await Session.create({
            userId: user._id,
            deviceId: deviceId,
            ipAddress: req.ip,
            userAgent: req.headers['user-agent'],
        });

        // --- STEP 4: SEND RESPONSE ---
        // We send back user info, including the important `profileCompleted` flag.
        // The frontend will use this to decide where to redirect the user.
        res.status(201).json({
            message: "Login successful",
            sessionId: newSession._id,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted: user.profileCompleted,
            },
            // token: ... we will generate a JWT here later
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error during login." });
    }
};

export const logout = async (req, res) => {
    // ... (logout logic remains the same)
};