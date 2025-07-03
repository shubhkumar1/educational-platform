import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { CheckCircle, Award } from 'lucide-react';

const QuizResultPage = () => {
    const location = useLocation();
    const { score, total, quizTitle } = location.state || { score: 0, total: 0, quizTitle: 'Quiz' };
    
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md text-center p-8">
                    <div className="flex justify-center items-center">
                        <Award className="h-16 w-16 text-yellow-500" />
                    </div>
                    <h1 className="mt-4 text-2xl font-bold tracking-tight text-gray-900">Quiz Completed!</h1>
                    <p className="mt-2 text-sm text-gray-600">You have completed the "{quizTitle}" quiz.</p>

                    <div className="mt-8">
                        <p className="text-sm font-medium text-gray-500">Your Score</p>
                        <p className="mt-1 text-5xl font-extrabold text-blue-600">{score} / {total}</p>
                        <p className="mt-2 text-xl font-semibold text-teal-600">{percentage}%</p>
                    </div>

                    <div className="mt-8">
                        <Link to="/quizzes" className="btn-primary">
                            Back to All Quizzes
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizResultPage;
