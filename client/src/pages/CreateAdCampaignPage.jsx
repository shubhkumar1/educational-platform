import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const CreateAdCampaignPage = () => {
    const navigate = useNavigate();
    const [campaignName, setCampaignName] = useState('');
    const [advertiser, setAdvertiser] = useState('');
    const [targetAudience, setTargetAudience] = useState('all');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/admin/campaigns', {
                campaignName,
                advertiser,
                targetAudience,
                // adContent would be collected here as well
            });
            alert('Ad Campaign created successfully!');
            navigate('/admin/dashboard');
        } catch (error) {
            alert('Failed to create ad campaign.');
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h2>Create New Ad Campaign</h2>
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Campaign Name</label>
                        <input type="text" value={campaignName} onChange={e => setCampaignName(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Advertiser</label>
                        <input type="text" value={advertiser} onChange={e => setAdvertiser(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Target Audience</label>
                        <select value={targetAudience} onChange={e => setTargetAudience(e.target.value)} style={{ width: '100%', padding: '0.5rem' }}>
                            <option value="all">All Users</option>
                            <option value="students">Students</option>
                            <option value="creators">Creators</option>
                        </select>
                    </div>
                    <button type="submit" style={{ padding: '0.5rem 1rem' }}>Save Campaign</button>
                </form>
            </div>
        </div>
    );
};

export default CreateAdCampaignPage;