// In a real app, this would fetch from the JobPosting model
const mockJobs = [
    { _id: 'job1', title: 'Software Engineer Intern', companyName: 'Tech Solutions Inc.', location: 'Remote', type: 'Internship', description: 'Work on exciting projects...', applyLink: '#' },
    { _id: 'job2', title: 'Frontend Developer', companyName: 'Creative Designs LLC', location: 'Patna', type: 'Full-time', description: 'Build beautiful user interfaces...', applyLink: '#' },
    { _id: 'job3', title: 'Data Analyst Intern', companyName: 'Data Insights', location: 'Bangalore', type: 'Internship', description: 'Analyze data and generate reports...', applyLink: '#' },
    { _id: 'job4', title: 'Backend Developer', companyName: 'Tech Solutions Inc.', location: 'Remote', type: 'Full-time', description: 'Develop robust server-side applications...', applyLink: '#' },
];


// @desc    Fetch all job postings
// @route   GET /api/jobs
export const getJobs = async (req, res) => {
    try {
        // In a real app: const jobs = await JobPosting.find({}).sort({ postedDate: -1 });
        res.json(mockJobs);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};