import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Plus, Trash2, Check } from 'lucide-react';

const CreateQuizPage = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Logic');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
    ]);
    const [loading, setLoading] = useState(false);

    const handleQuestionChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].questionText = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };
    
    const handleCorrectAnswerChange = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswerIndex = oIndex;
        setQuestions(newQuestions);
    };

    const addQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = questions.filter((_, index) => index !== qIndex);
        setQuestions(newQuestions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const filteredQuestions = questions.filter(q =>
            q.questionText.trim() !== '' &&
            q.options.every(opt => opt.trim() !== '')
        );
        if (filteredQuestions.length === 0) {
            alert('Please add at least one complete question.');
            setLoading(false);
            return;
        }
        try {
            await axios.post('http://localhost:8080/api/quizzes', {
                title,
                description,
                category,
                questions: filteredQuestions,
            });
            alert('Quiz created successfully!');
            navigate('/creator/dashboard');
        } catch (error) {
            alert('Error creating quiz.');
        } finally {
            setLoading(false);
        }
    };

    const labelStyle = "block text-sm font-semibold text-gray-800";
    const inputStyle = "mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2 px-3";

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-6 sm:p-8">
                    <header className="border-b pb-6 mb-6">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New Quiz</h1>
                        <p className="mt-1 text-gray-500">Build a new quiz for your students.</p>
                    </header>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className={labelStyle}>Quiz Title</label>
                            <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className={inputStyle} />
                        </div>
                        <div>
                            <label htmlFor="description" className={labelStyle}>Description</label>
                            <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="3" className={inputStyle}></textarea>
                        </div>
                        <div>
                            <label htmlFor="category" className={labelStyle}>Category</label>
                            <select id="category" value={category} onChange={e => setCategory(e.target.value)} className={inputStyle}>
                                <option>Logic</option>
                                <option>Technology</option>
                                <option>Science</option>
                                <option>General Knowledge</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            <label className={labelStyle}>Questions</label>
                            {questions.map((q, qIndex) => (
                                <div key={qIndex} className="rounded-lg border border-gray-200 p-4 space-y-3 bg-gray-50/50">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-700">Question {qIndex + 1}</label>
                                        <button type="button" onClick={() => removeQuestion(qIndex)} className="btn-icon text-red-500 hover:bg-red-50" title="Remove Question">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <textarea value={q.questionText} onChange={e => handleQuestionChange(qIndex, e.target.value)} placeholder="Enter your question here" required rows="2" className={inputStyle}></textarea>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-medium text-gray-600">Options (Select the correct answer)</label>
                                        {q.options.map((opt, oIndex) => (
                                            <div key={oIndex} className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`correctAnswer_q${qIndex}`}
                                                    checked={q.correctAnswerIndex === oIndex}
                                                    onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                                                    className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                                />
                                                <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} required className="flex-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-1 px-2" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-4">
                            <button type="button" onClick={addQuestion} className="btn-secondary">
                                <Plus size={16} className="mr-2" /> Add Question
                            </button>
                            <button type="submit" className="btn-primary" disabled={loading}>
                                {loading ? 'Saving...' : <><Check size={16} className="mr-2" /> Save Quiz</>}
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default CreateQuizPage;
