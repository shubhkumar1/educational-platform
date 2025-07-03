import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CalendarCheck } from 'lucide-react';

const EditStreamPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [youtubeVideoId, setYoutubeVideoId] = useState('');
    const [scheduledTime, setScheduledTime] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStream = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/streams/${id}`);
                setTitle(data.title);
                setDescription(data.description || '');
                setYoutubeVideoId(data.youtubeVideoId);
                // Format the date correctly for the datetime-local input
                setScheduledTime(new Date(data.scheduledTime).toISOString().slice(0, 16));
            } catch (error) {
                alert('Could not load stream data.');
            } finally {
                setLoading(false);
            }
        };
        fetchStream();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put(`http://localhost:8080/api/streams/${id}`, {
                title, description, youtubeVideoId, scheduledTime
            });
            alert('Live stream updated successfully!');
            navigate('/creator/dashboard');
        } catch (error) {
            alert('Failed to update stream.');
        } finally {
            setLoading(false);
        }
    };
    
    const labelStyle = "block text-sm font-semibold text-gray-800";
    const inputStyle = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3";

    if (loading) return <div>Loading Stream Editor...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                    <header className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Edit Scheduled Class</h1>
                        <p className="mt-1 text-gray-500">Update the details for your live stream.</p>
                    </header>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className={labelStyle}>Class Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="youtubeVideoId" className={labelStyle}>YouTube Video ID</label>
                            <input type="text" id="youtubeVideoId" value={youtubeVideoId} onChange={e => setYoutubeVideoId(e.target.value)} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="scheduledTime" className={labelStyle}>Date and Time</label>
                            <input type="datetime-local" id="scheduledTime" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelStyle}>Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="4" className={inputStyle}></textarea>
                        </div>
                        <div className="pt-4 flex justify-end">
                            <button type="submit" className="btn-primary bg-green-600 hover:bg-green-700 focus:ring-green-500" disabled={loading}>
                                {loading ? 'Saving...' : <><CalendarCheck size={16} className="mr-2" /> Update Schedule</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default EditStreamPage;
