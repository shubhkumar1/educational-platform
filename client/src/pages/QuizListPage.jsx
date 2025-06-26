import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const QuizListPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const { data } = await axios.get('http://localhost:8080/api/quizzes');
                setQuizzes(data);
            } catch (error) {
                console.error("Failed to fetch quizzes", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    if (loading) return <div>Loading quizzes...</div>;

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Available Quizzes</h2>
                {quizzes.length > 0 ? quizzes.map(quiz => (
                    <div key={quiz._id} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                        <h3>{quiz.title}</h3>
                        <p>{quiz.description}</p>
                        <Link to={`/quiz/${quiz._id}`}>Start Quiz</Link>
                    </div>
                )) : <p>No quizzes available at the moment.</p>}
            </div>
        </div>
    );
};
export default QuizListPage;