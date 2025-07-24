import Subscription from '../models/Subscription.js';

/**
 * @desc    Increment usage minutes for a free-tier user
 * @route   POST /api/usage/tick
 * @access  Private (Student)
 */
export const tickUsage = async (req, res) => {
    try {
        // Find the subscription for the logged-in user and increment their usage
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { userId: req.user._id, status: 'free_tier' },
            { $inc: { monthlyUsageMinutes: 1 } },
            { new: true } // Return the updated document
        );

        if (updatedSubscription) {
            res.json({
                usage: updatedSubscription.monthlyUsageMinutes,
                limit: 100,
            });
        } else {
            // This will be the case for subscribed users, for whom we don't track usage
            res.json({ message: 'Usage tracking not applicable for this user.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating usage.' });
    }
};
