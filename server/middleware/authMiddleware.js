import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
    let token;

    // FIX: Read the JWT from the 'token' cookie instead of the Authorization header
    token = req.cookies.token;

    if (token) {
        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token and attach to the request object
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

export default protect;