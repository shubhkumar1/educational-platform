import User from '../models/User.js';

// @desc    Complete user profile after first login
// @route   POST /api/profile/complete
// @access  Private (should be used after login)
export const completeProfile = async (req, res) => {
    // In a real app, req.user.id would come from the 'protect' middleware
    const userId = req.user.id; 

    // The frontend would send the chosen role and form data
    const { name, age, city, college, department, honoursPaper } = req.body;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // FIX: Update the user document with all the new details
        user.name = name || user.name;
        user.age = age || user.age;
        user.city = city || user.city;
        user.college = college || user.college;
        user.department = department || user.department;
        user.honoursPaper = honoursPaper || user.honoursPaper;
        user.profileCompleted = true; // Mark profile as complete

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            profileCompleted: updatedUser.profileCompleted,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};