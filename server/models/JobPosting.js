import mongoose from 'mongoose';

const jobPostingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    companyName: { type: String, required: true },
    location: { type: String, required: true },
    type: {
        type: String,
        enum: ['Internship', 'Full-time', 'Part-time'],
        required: true,
    },
    description: { type: String, required: true },
    requirements: [String],
    applyLink: { type: String, required: true },
    postedDate: { type: Date, default: Date.now },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // For admin or company partner
});

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);
export default JobPosting;