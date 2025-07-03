import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { PlayCircle, FileText, FileQuestion, ArrowRight, Briefcase } from 'lucide-react';

// Reusable component for content cards
const ContentCard = ({ item, type }) => {
    const link = type === 'blog' ? `/blogs/${item.slug}` : `/quiz/${item._id}`;
    const icon = type === 'blog' ? <FileText className="text-teal-500" /> : <FileQuestion className="text-blue-500" />;

    return (
        <Link to={link} className="block rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
            <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
                    {icon}
                </div>
                <div>
                    <p className="font-semibold text-gray-800 line-clamp-2">{item.title}</p>
                    <p className="mt-1 text-xs text-gray-500">{item.category || 'General'}</p>
                </div>
            </div>
        </Link>
    );
};


const StudentDashboard = () => {
    // --- FIX: State is now initialized to be empty ---
    const [dashboardData, setDashboardData] = useState({
        blogs: [],
        quizzes: [],
        videos: [{ id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to' }] // Keep video static for now
    });
    const [loading, setLoading] = useState(true);

    // --- FIX: Added useEffect to fetch real data from the backend ---
    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch latest 4 blogs and 4 quizzes
                const [blogRes, quizRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/blogs?limit=4'),
                    axios.get('http://localhost:8080/api/quizzes?limit=4')
                ]);
                
                setDashboardData(prevData => ({
                    ...prevData,
                    blogs: blogRes.data,
                    quizzes: quizRes.data,
                }));

            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);


    if (loading) return <div className="flex justify-center items-center h-screen">Loading Dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back!</h1>
                        <p className="mt-1 text-gray-500">Let's continue your learning journey.</p>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
                    
                    <div className="space-y-8 lg:col-span-2">
                        {/* Continue Watching Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Continue Watching</h2>
                            <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
                                <div className="aspect-w-16 aspect-h-9">
                                    <iframe 
                                        src={`http://googleusercontent.com/youtube.com/5{dashboardData.videos[0].id}`} 
                                        title="Featured Video" 
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                        className="h-full w-full"
                                    ></iframe>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-800">{dashboardData.videos[0].title}</h3>
                                    <Link to="/videos" className="mt-2 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800">
                                        Watch More Videos <ArrowRight size={16} className="ml-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Featured Quizzes Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Featured Quizzes</h2>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {dashboardData.quizzes.map(quiz => (
                                    <ContentCard key={quiz._id} item={quiz} type="quiz" />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8">
                        {/* Latest Blogs Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Latest Blog Posts</h2>
                            <div className="mt-4 space-y-4">
                                {dashboardData.blogs.map(blog => (
                                    <ContentCard key={blog._id} item={blog} type="blog" />
                                ))}
                            </div>
                        </div>

                        {/* Jobs & Internships Section */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Opportunities</h2>
                            <div className="mt-4">
                                <Link to="/jobs" className="flex items-center justify-between rounded-lg bg-teal-500 p-6 text-white transition-all hover:bg-teal-600">
                                    <div>
                                        <h3 className="text-lg font-bold">Jobs & Internships</h3>
                                        <p className="text-sm opacity-90">Find your next career move.</p>
                                    </div>
                                    <Briefcase size={24} />
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default StudentDashboard;
