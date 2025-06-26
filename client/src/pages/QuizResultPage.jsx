import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const QuizResultPage = () => {
    const location = useLocation();
    const { score, total } = location.state || { score: 0, total: 0 };

    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Quiz Completed!</h2>
            <h3>Your Score:</h3>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{score} / {total}</p>
            <Link to="/quizzes">Back to Quizzes</Link>
        </div>
    );
};
export default QuizResultPage;