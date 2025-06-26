import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

const FREE_TIER_MINUTE_LIMIT = 200;

const accessControl = async (req, res, next) => {
    const mockUser = await User.findOne({ email: 'student@example.com' });
    if (!mockUser) {
        return res.status(401).json({ message: 'User not found for access control.' });
    }

    try {
        const subscription = await Subscription.findOne({ userId: mockUser._id });

        if (!subscription) return res.status(403).json({ message: 'Subscription details not found.' });
        if (subscription.status === 'active') return next();

        if (subscription.status === 'free_tier') {
            if (subscription.monthlyUsageMinutes >= FREE_TIER_MINUTE_LIMIT) {
                return res.status(403).json({ message: 'Usage limit reached. Please upgrade.' });
            }
            return next();
        }

        return res.status(403).json({ message: 'Your account does not have access.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error during access control check.' });
    }
};

export default accessControl;