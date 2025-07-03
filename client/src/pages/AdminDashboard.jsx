import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
    const [data, setData] = useState({ users: [], campaigns: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/api/admin/dashboard-data');
                setData(data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading Admin Dashboard...</div>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '2rem' }}>
                <h2>Admin Dashboard</h2>

                {/* User Management Section */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3>User Management</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid #ccc' }}>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                                <th style={{ padding: '0.5rem', textAlign: 'left' }}>Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.users.map(user => (
                                <tr key={user._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem' }}>{user.name}</td>
                                    <td style={{ padding: '0.5rem' }}>{user.email}</td>
                                    <td style={{ padding: '0.5rem' }}>{user.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ads Management Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Ad Campaigns</h3>
                        <Link to="/admin/ads/create">
                            <button>Create New Campaign</button>
                        </Link>
                    </div>
                    {data.campaigns.length > 0 ? data.campaigns.map(campaign => (
                        <div key={campaign._id} style={{ border: '1px solid #ccc', padding: '1rem', marginTop: '1rem' }}>
                            <p><strong>Campaign:</strong> {campaign.campaignName} | <strong>Advertiser:</strong> {campaign.advertiser}</p>
                            <p><strong>Status:</strong> {campaign.status}</p>
                        </div>
                    )) : <p>No ad campaigns found.</p>}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;