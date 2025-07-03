import mongoose from 'mongoose';

const adCampaignSchema = new mongoose.Schema({
    campaignName: { type: String, required: true },
    advertiser: { type: String, required: true },
    targetAudience: { // The basis for our "Ad targeting system"
        type: String,
        enum: ['all', 'students', 'creators'],
        default: 'all',
    },
    adContent: {
        imageUrl: String,
        headline: String,
        bodyText: String,
        callToAction: String,
    },
    status: {
        type: String,
        enum: ['active', 'paused', 'ended'],
        default: 'active',
    },
}, { timestamps: true });

const AdCampaign = mongoose.model('AdCampaign', adCampaignSchema);
export default AdCampaign;