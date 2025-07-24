import Subscription from '../models/Subscription.js';

// @desc    Get the subscription status for the logged-in user
// @route   GET /api/subscriptions/status
// @access  Private
export const getSubscriptionStatus = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ userId: req.user._id });

    if (!subscription) {
      // This case might happen if subscription creation failed for a user
      return res.status(404).json({ message: 'Subscription not found.' });
    }

    res.status(200).json(subscription);
  } catch (error) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};