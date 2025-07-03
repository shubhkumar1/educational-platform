import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FileText, Edit, Trash2, Eye, BarChart2, Users, IndianRupee, Video, FileQuestion} from 'lucide-react';

// A reusable card component for displaying stats
const StatCard = ({ title, value, icon }) => (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="text-gray-400">{icon}</div>
        </div>
        <p className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">{value}</p>
    </div>
);

// A reusable component for each list item
const ContentRow = ({ item, type, onEdit, onDelete, onPreview }) => (
    <div className="flex flex-col items-start gap-3 p-4 transition-colors hover:bg-gray-50 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
            <div className="hidden sm:flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-600">
                {type === 'blog' ? <FileText size={18} /> : type === 'quiz' ? <FileQuestion size={18} /> : <Video size={18} />}
            </div>
            <div>
                <p className="font-semibold text-gray-800">{item.title}</p>
                {item.scheduledTime && (
                    <p className="text-xs text-gray-500">
                        Scheduled: {new Date(item.scheduledTime).toLocaleString()}
                    </p>
                )}
            </div>
        </div>
        <div className="flex w-full items-center gap-2 sm:w-auto">
            <button onClick={onPreview} className="btn-icon flex-1 sm:flex-initial" title="Preview"><Eye size={16} /></button>
            <button onClick={onEdit} className="btn-icon flex-1 sm:flex-initial" title="Edit"><Edit size={16} /></button>
            <button onClick={onDelete} className="btn-icon flex-1 sm:flex-initial text-red-500 hover:bg-red-50" title="Delete"><Trash2 size={16} /></button>
        </div>
    </div>
);

const CreatorDashboard = () => {
    const navigate = useNavigate();
    const [analytics, setAnalytics] = useState(null);
    const [content, setContent] = useState({ blogs: [], quizzes: [], streams: [] });
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, contentRes] = await Promise.all([
                axios.get('http://localhost:8080/api/dashboard/creator'),
                axios.get('http://localhost:8080/api/creator/content')
            ]);
            setAnalytics(analyticsRes.data);
            setContent(contentRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const deleteHandler = async (type, id) => {
        let endpoint;
        if (type === 'blog') endpoint = `/api/blogs/${id}`;
        if (type === 'quiz') endpoint = `/api/quizzes/${id}`;
        if (type === 'stream') endpoint = `/api/streams/${id}`;
        
        if (endpoint && window.confirm(`Are you sure you want to delete this ${type}?`)) {
            try {
                await axios.delete(`http://localhost:8080${endpoint}`);
                fetchData();
            } catch (error) {
                alert(`Failed to delete ${type}.`);
            }
        }
    };

    if (loading) return <div>Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Creator Dashboard</h1>
                        <p className="mt-1 text-gray-500">Manage your content and track your performance.</p>
                    </div>
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                        <Link to="/creator/blogs/create" className="btn-primary">Create Blog</Link>
                        <Link to="/creator/streams/schedule" className="btn-secondary">Schedule Live</Link>
                        <Link to="/creator/quizzes/create" className="btn-secondary">Create Quiz</Link>
                        <Link to="/creator/pricing" className="btn-secondary"><IndianRupee size={14} className="mr-2" />Pricing</Link>
                    </div>
                </div>

                {/* Analytics Grid */}
                {analytics && (
                    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        <StatCard title="Total Revenue" value={`₹${analytics.revenue.total.toFixed(2)}`} icon={<IndianRupee size={20} />} />
                        <StatCard title="Total Students" value={analytics.enrollments.total} icon={<Users size={20} />} />
                        <StatCard title="New Students (Month)" value={analytics.enrollments.newThisMonth} icon={<BarChart2 size={20} />} />
                    </div>
                )}
                
                {/* Chart Section */}
                {analytics && (
                    <div className="mt-8 rounded-xl border bg-white p-4 shadow-sm sm:p-6">
                        <h3 className="text-lg font-semibold text-gray-800">Monthly Revenue</h3>
                        <div className="mt-4 h-64 sm:h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={analytics.monthlyRevenueChart} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                                    <YAxis stroke="#6b7280" fontSize={12} tickFormatter={(value) => `₹${value}`} />
                                    <Tooltip wrapperClassName="rounded-md border bg-white p-2 shadow-sm" />
                                    <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={{ r: 4, fill: '#14b8a6' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
                
                {/* Content Management Section */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-900">My Content</h2>
                    <div className="mt-4 grid grid-cols-1 gap-8 lg:grid-cols-1">
                        {/* Blogs List */}
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <h3 className="border-b bg-gray-50 p-4 text-lg font-semibold">Blogs</h3>
                            <div className="divide-y divide-gray-200">
                                {content.blogs.length > 0 ? content.blogs.map(blog => (
                                    <ContentRow key={blog._id} item={blog} type="blog" onEdit={() => navigate(`/creator/blogs/edit/${blog._id}`)} onDelete={() => deleteHandler('blog', blog._id)} onPreview={() => window.open(`/blogs/${blog.slug}`, '_blank')} />
                                )) : <p className="p-4 text-sm text-gray-500">No blogs created yet.</p>}
                            </div>
                        </div>

                        {/* Quizzes List */}
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <h3 className="border-b bg-gray-50 p-4 text-lg font-semibold">Quizzes</h3>
                            <div className="divide-y divide-gray-200">
                                {content.quizzes.length > 0 ? content.quizzes.map(quiz => (
                                    <ContentRow key={quiz._id} item={quiz} type="quiz" onEdit={() => navigate(`/creator/quizzes/edit/${quiz._id}`)} onDelete={() => deleteHandler('quiz', quiz._id)} onPreview={() => window.open(`/quiz/${quiz._id}`, '_blank')} />
                                )) : <p className="p-4 text-sm text-gray-500">No quizzes created yet.</p>}
                            </div>
                        </div>
                    
                        {/* Scheduled Live Classes List */}
                        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                            <h3 className="border-b bg-gray-50 p-4 text-lg font-semibold">Scheduled Live Classes</h3>
                            <div className="divide-y divide-gray-200">
                                {content.streams && content.streams.length > 0 ? content.streams.map(stream => (
                                    <ContentRow key={stream._id} item={stream} type="stream" onEdit={() => navigate(`/creator/streams/edit/${stream._id}`)} onDelete={() => deleteHandler('stream', stream._id)} onPreview={() => window.open(`https://www.youtube.com/watch?v=$$${stream.youtubeVideoId}`, '_blank')} />
                                )) : <p className="p-4 text-sm text-gray-500">No live classes scheduled yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CreatorDashboard;