import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OnboardingPage = () => {
    const navigate = useNavigate();
    const { user, setUser } = useAuth(); // Get user and setUser to update context
    const [role, setRole] = useState('student'); // Default selection

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // This endpoint was created in Response 19's refactoring
            const { data } = await axios.post('http://localhost:8080/api/profile/complete', {
                role: role,
                // We would send other profile form data here
            });

            // Update the user in our global context with the new data from the server
            setUser(data.user);

            // Redirect to the correct dashboard
            navigate(`/${data.user.role}/dashboard`);

        } catch (error) {
            console.error("Profile completion failed:", error);
            alert("Could not complete profile setup. Please try again.");
        }
    };

    return (
        <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '500px', margin: 'auto' }}>
            <h2>Welcome, {user?.name}!</h2>
            <p>To get started, please select your role on the platform.</p>
            <form onSubmit={handleSubmit}>
                <div style={{ margin: '2rem 0' }}>
                    <div style={{ marginBottom: '1rem' }}>
                        <input type="radio" id="student" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} />
                        <label htmlFor="student"> I am a Student</label>
                    </div>
                    <div>
                        <input type="radio" id="creator" name="role" value="creator" checked={role === 'creator'} onChange={() => setRole('creator')} />
                        <label htmlFor="creator"> I am a Creator / Mentor</label>
                    </div>
                </div>
                <button type="submit" style={{ padding: '0.75rem 1.5rem' }}>Continue</button>
            </form>
        </div>
    );
};

export default OnboardingPage;