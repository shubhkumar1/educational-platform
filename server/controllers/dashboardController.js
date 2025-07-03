import Blog from '../models/Blog.js';
import Quiz from '../models/Quiz.js';
import Enrollment from '../models/Enrollment.js';
import Transaction from '../models/Transaction.js';

export const getCreatorAnalytics = async (req, res) => {
    const creatorId = req.user.id; // Get the real creator ID

    try {
        // 1. Get Enrollment Metrics
        const totalEnrollments = await Enrollment.countDocuments({ creatorId });

        // 2. Get Content Performance
        const blogs = await Blog.find({ author: creatorId }).select('title views');
        const quizzes = await Quiz.find({ creatorId: creatorId }).select('title views');
        const contentPerformance = [...blogs, ...quizzes].sort((a, b) => b.views - a.views).slice(0, 5); // Top 5 viewed content

        // 3. Get Revenue (Simplified for this example)
        // A real implementation would involve complex date-based aggregation.
        // We will just calculate total revenue for now.
        const successfulTransactions = await Transaction.find({ status: 'Success' /*, creatorId: creatorId */ }); // Assuming transactions can be linked to a creator
        const totalRevenue = successfulTransactions.reduce((acc, trans) => acc + trans.amount, 0);

        // Assemble the final analytics object
        const analytics = {
            revenue: {
                currentMonth: 0, // Placeholder
                lastMonth: 0,    // Placeholder
                total: totalRevenue,
            },
            enrollments: {
                total: totalEnrollments,
                newThisMonth: 0, // Placeholder
            },
            contentPerformance: contentPerformance.map(c => ({ title: c.title, views: c.views, type: c.questions ? 'Quiz' : 'Blog' })),
            monthlyRevenueChart: [], // Placeholder for complex chart data
        };

        res.json(analytics);

    } catch (error) {
        console.error('Error fetching creator analytics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};