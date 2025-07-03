import mongoose from 'mongoose';

const liveStreamSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    youtubeVideoId: { // The 11-character ID from the YouTube video URL
        type: String,
        required: true,
    },
    scheduledTime: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Live', 'Ended'],
        default: 'Scheduled',
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

const LiveStream = mongoose.model('LiveStream', liveStreamSchema);
export default LiveStream;