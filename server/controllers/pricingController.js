import User from '../models/User.js';

// @desc    Set or update a creator's pricing model
// @route   PUT /api/pricing
// @access  Private (for Creators)
export const setPricing = async (req, res) => {
    const creatorId = req.user.id;

    try {
        const { model, price } = req.body;

        const creator = await User.findById(creatorId);

        if (!creator || creator.role !== 'creator') {
            return res.status(404).json({ message: 'Creator not found.' });
        }

        creator.pricing = { model, price };
        await creator.save();

        res.json(creator.pricing);

    } catch (error) {
        console.error('Error setting pricing:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};