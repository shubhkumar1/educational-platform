import React from 'react';
import { useAuth } from '../context/AuthContext';

const UsageTracker = () => {
    const { usageDetails } = useAuth();

    if (!usageDetails || usageDetails.status !== 'free_tier') {
        return null;
    }

    const remainingMinutes = Math.max(0, usageDetails.limit - usageDetails.usage);
    const percentage = (usageDetails.usage / usageDetails.limit) * 100;

    return (
        <div style={{ border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 0.5rem 0' }}>
                You have <strong>{remainingMinutes}</strong> of <strong>{usageDetails.limit}</strong> free minutes remaining.
            </p>
            <div style={{ width: '100%', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                <div style={{ width: `${percentage}%`, backgroundColor: '#4299e1', height: '10px', borderRadius: '4px' }}></div>
            </div>
            {remainingMinutes <= 0 && (
                <p style={{ color: '#e53e3e', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    Your free time has expired. Please upgrade to continue accessing content.
                </p>
            )}
        </div>
    );
};

export default UsageTracker;