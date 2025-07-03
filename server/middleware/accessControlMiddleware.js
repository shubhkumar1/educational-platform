import Subscription from '../models/Subscription.js';
import Blog from '../models/Blog.js'; // <-- Import the Blog model

const FREE_TIER_MINUTE_LIMIT = 200;

const accessControl = async (req, res, next) => {
    try {

        if (req.user.role === 'creator' || req.user.role === 'admin') {
            return next();
        }

        const userId = req.user._id;
        const contentId = req.params.id; // Get the ID of the content being accessed

        // --- FIX: Check if the user is the author of the blog post ---
        if (contentId) {
            const blog = await Blog.findById(contentId);
            // If the blog exists and the logged-in user is the author, grant access immediately
            if (blog && blog.author.toString() === userId.toString()) {
                return next();
            }
        }
        // -----------------------------------------------------------------

        // If the user is not the author, proceed with the normal student subscription check
        const subscription = await Subscription.findOne({ userId: userId });

        if (!subscription) {
            return res.status(403).json({ message: 'Subscription details not found.' });
        }

        if (subscription.status === 'active') {
            return next();
        }

        if (subscription.status === 'free_tier') {
            if (subscription.monthlyUsageMinutes >= FREE_TIER_MINUTE_LIMIT) {
                return res.status(403).json({ message: 'Usage limit reached. Please upgrade.' });
            }
            return next();
        }

        return res.status(403).json({ message: 'Your account does not have access.' });

    } catch (error) {
        console.error("Access Control Error:", error);
        res.status(500).json({ message: 'Server error during access control check.' });
    }
};

export default accessControl;