import Subscription from '../models/Subscription.js';

const FREE_TIER_MINUTE_LIMIT = 100;

const accessControl = async (req, res, next) => {
    try {
        // Allow creators and admins to bypass all student checks
        if (req.user.role === 'creator' || req.user.role === 'admin') {
            return next();
        }

        // For students, fetch their subscription
        const subscription = await Subscription.findOne({ userId: req.user._id });

        if (!subscription) {
            return res.status(403).json({ message: 'Subscription details not found.' });
        }

        // If the user is on a paid plan, they always have access
        if (subscription.status === 'active') {
            return next();
        }

        // If the user is on the free tier, check their usage
        if (subscription.status === 'free_tier') {
            if (subscription.monthlyUsageMinutes >= FREE_TIER_MINUTE_LIMIT) {
                // If they have exceeded the limit, block access
                return res.status(403).json({ message: 'Your free exploration time has expired. Please upgrade to continue.' });
            }
            // If they have time remaining, allow access
            return next();
        }

        // For any other status, block access
        return res.status(403).json({ message: 'Your account does not have access.' });

    } catch (error) {
        res.status(500).json({ message: 'Server error during access control check.' });
    }
};

export default accessControl;
