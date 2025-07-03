import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FileQuestion, ArrowRight } from 'lucide-react';

// A reusable component for each quiz card
const QuizCard = ({ quiz }) => (
    <div className="flex flex-col justify-between rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
        <div>
            <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    <FileQuestion size={24} />
                </div>
                <h2 className="text-lg font-bold text-gray-800">{quiz.title}</h2>
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{quiz.description}</p>
        </div>
        <div className="mt-6">
            <Link to={`/quiz/${quiz._id}`} className="btn-primary w-full">
                Start Quiz <ArrowRight size={16} className="ml-2" />
            </Link>
        </div>
    </div>
);


const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/api/quizzes');
                setQuizzes(data);
            } catch (err) {
                setError('Could not load quizzes at this time. Please try again later.');
                console.error("Failed to fetch quizzes", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Quizzes...</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="border-b border-gray-200 pb-6">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Available Quizzes</h1>
                    <p className="mt-1 text-gray-500">Test your knowledge with one of our quizzes below.</p>
                </div>

                {/* Quizzes Grid */}
                <div className="mt-8">
                    {error ? (
                        <p className="text-center text-red-500">{error}</p>
                    ) : quizzes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {quizzes.map(quiz => (
                                <QuizCard key={quiz._id} quiz={quiz} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-500">No quizzes available at the moment.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default QuizListPage;
