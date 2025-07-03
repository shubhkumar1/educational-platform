import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ArrowRight } from 'lucide-react';

const QuizTakingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const { data } = await axios.get(`http://localhost:8080/api/quizzes/${id}`);
                setQuiz(data);
            } catch (error) {
                console.error("Failed to fetch quiz", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id]);

    const handleAnswerSelect = (oIndex) => {
        setSelectedOption(oIndex);
        setAnswers({ ...answers, [currentQuestionIndex]: oIndex });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null); // Reset selection for the next question
        } else {
            handleSubmit(); // Auto-submit on the last question
        }
    };
    
    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(`http://localhost:8080/api/quizzes/${id}/submit`, { answers });
            navigate(`/quiz/${id}/result`, { state: { score: data.score, total: data.total, quizTitle: quiz.title } });
        } catch (error) {
            alert("There was an error submitting your quiz.");
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading Quiz...</div>;
    if (!quiz) return <div className="flex justify-center items-center h-screen">Quiz not found.</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progressPercentage = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-md">
                    {/* Header with Progress Bar */}
                    <div className="p-6 border-b">
                        <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
                        <p className="text-sm text-gray-500 mt-1">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>

                    {/* Question and Options */}
                    <div className="p-6">
                        <p className="text-lg font-semibold text-gray-900">{currentQuestion.questionText}</p>
                        <div className="mt-6 space-y-4">
                            {currentQuestion.options.map((option, oIndex) => {
                                const isSelected = selectedOption === oIndex;
                                return (
                                    <label
                                        key={oIndex}
                                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'border-gray-300 hover:bg-gray-50'}`}
                                    >
                                        <input
                                            type="radio"
                                            name={`q_option`}
                                            checked={isSelected}
                                            onChange={() => handleAnswerSelect(oIndex)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span className="ml-3 text-sm font-medium text-gray-800">{option}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer with Next Button */}
                    <div className="p-6 bg-gray-50 rounded-b-lg flex justify-end">
                        <button onClick={handleNext} disabled={selectedOption === null} className="btn-primary disabled:bg-gray-300">
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                            <ArrowRight size={16} className="ml-2" />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QuizTakingPage;
