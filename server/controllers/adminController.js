import User from '../models/User.js';
import AdCampaign from '../models/AdCampaign.js';

// @desc    Get data for the admin dashboard (users and campaigns)
// @route   GET /api/admin/dashboard-data
export const getAdminDashboardData = async (req, res) => {
    try {
        const users = await User.find({}).select('name email role');
        const campaigns = await AdCampaign.find({});
        res.json({ users, campaigns });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a new ad campaign
// @route   POST /api/admin/campaigns
export const createAdCampaign = async (req, res) => {
    try {
        const { campaignName, advertiser, targetAudience, adContent } = req.body;
        const newCampaign = await AdCampaign.create({
            campaignName,
            advertiser,
            targetAudience,
            adContent,
        });
        res.status(201).json(newCampaign);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};