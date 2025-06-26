import User from '../models/User.js';

// @desc    Complete user profile after first login
// @route   POST /api/profile/complete
// @access  Private (should be used after login)
export const completeProfile = async (req, res) => {
    // In a real app, req.user.id would come from the 'protect' middleware
    // const userId = req.user.id; 
    const mockUserId = '60d5f1b2b3b4f8a0b4e9f8a0'; // Using mock user for now

    // The frontend would send the chosen role and form data
    const { role, fullName, age, interests } = req.body;

    try {
        const user = await User.findById(mockUserId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user document with profile data
        user.name = fullName || user.name;
        user.role = role || user.role;
        // ... (update other fields like age, interests, etc.)
        
        // This flag is important to prevent users from seeing the form again
        user.profileCompleted = true;

        await user.save();

        res.status(200).json({
            message: 'Profile completed successfully.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileCompleted: user.profileCompleted,
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};