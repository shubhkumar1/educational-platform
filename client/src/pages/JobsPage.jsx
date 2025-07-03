import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const JobsPage = () => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    // State for filters
    const [searchTerm, setSearchTerm] = useState('');
    const [jobType, setJobType] = useState('All');
    const [location, setLocation] = useState('All');

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/api/jobs');
                setJobs(data);
                setFilteredJobs(data);
            } catch (error) {
                console.error("Failed to fetch jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let result = jobs;
        if (searchTerm) {
            result = result.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.companyName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (jobType !== 'All') {
            result = result.filter(job => job.type === jobType);
        }
        if (location !== 'All') {
            result = result.filter(job => job.location === location);
        }
        setFilteredJobs(result);
    }, [searchTerm, jobType, location, jobs]);

    if (loading) return <div>Loading Jobs...</div>;

    // Get unique locations and types for filter dropdowns
    const locations = ['All', ...new Set(jobs.map(job => job.location))];
    const jobTypes = ['All', ...new Set(jobs.map(job => job.type))];

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h2>Job & Internship Updates</h2>
                {/* Filter Section */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', padding: '1rem', background: '#f9f9f9' }}>
                    <input type="text" placeholder="Search by title or company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ flex: 2, padding: '0.5rem' }} />
                    <select value={jobType} onChange={e => setJobType(e.target.value)} style={{ flex: 1, padding: '0.5rem' }}>
                        {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                    <select value={location} onChange={e => setLocation(e.target.value)} style={{ flex: 1, padding: '0.5rem' }}>
                        {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                </div>

                {/* Job Listings */}
                <div>
                    {filteredJobs.length > 0 ? filteredJobs.map(job => (
                        <div key={job._id} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
                            <h3>{job.title} - <span style={{ fontWeight: 'normal' }}>{job.companyName}</span></h3>
                            <p><strong>Type:</strong> {job.type} | <strong>Location:</strong> {job.location}</p>
                            <p>{job.description}</p>
                            <a href={job.applyLink} target="_blank" rel="noopener noreferrer">
                                <button>Apply Now</button>
                            </a>
                        </div>
                    )) : <p>No matching jobs found.</p>}
                </div>
            </div>
        </div>
    );
};

export default JobsPage;