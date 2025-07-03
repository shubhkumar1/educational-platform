import Subscription from '../models/Subscription.js';
import User from '../models/User.js';

export const tickUsage = async (req, res) => {
    const userId = req.user._id;
    if (!userId) return res.status(401).json({ message: 'User not found.' });

    try {
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { userId: userId, status: 'free_tier' },
            { $inc: { monthlyUsageMinutes: 1 } },
            { new: true }
        );

        if (updatedSubscription) {
            res.json({
                usage: updatedSubscription.monthlyUsageMinutes,
                limit: 200,
                status: updatedSubscription.status
            });
        } else {
            res.json({ message: 'Usage tracking not applicable for this subscription type.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating usage.' });
    }
};