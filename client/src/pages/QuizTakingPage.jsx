import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizTakingPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});

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

    const handleAnswerSelect = (questionIndex, answerIndex) => {
        setAnswers({ ...answers, [questionIndex]: answerIndex });
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleSubmit = async () => {
        try {
            const { data } = await axios.post(`http://localhost:8080/api/quizzes/${id}/submit`, { answers });
            navigate(`/quiz/${id}/result`, { state: { score: data.score, total: data.total } });
        } catch (error) {
            alert("There was an error submitting your quiz.");
        }
    };

    if (loading) return <div>Loading quiz...</div>;
    if (!quiz) return <div>Quiz not found.</div>;

    const currentQuestion = quiz.questions[currentQuestionIndex];

    return (
        <div style={{ padding: '2rem' }}>
            <h2>{quiz.title}</h2>
            <div>
                <h3>Question {currentQuestionIndex + 1} of {quiz.questions.length}</h3>
                <p>{currentQuestion.questionText}</p>
                <div>
                    {currentQuestion.options.map((option, index) => (
                        <div key={index}>
                            <input type="radio" id={`q${currentQuestionIndex}-o${index}`} name={`q${currentQuestionIndex}`} checked={answers[currentQuestionIndex] === index} onChange={() => handleAnswerSelect(currentQuestionIndex, index)} />
                            <label htmlFor={`q${currentQuestionIndex}-o${index}`}>{option}</label>
                        </div>
                    ))}
                </div>
            </div>
            {currentQuestionIndex < quiz.questions.length - 1 ? (
                <button onClick={handleNext} style={{ marginTop: '1rem' }} disabled={answers[currentQuestionIndex] === undefined}>Next</button>
            ) : (
                <button onClick={handleSubmit} style={{ marginTop: '1rem' }} disabled={answers[currentQuestionIndex] === undefined}>Submit</button>
            )}
        </div>
    );
};
export default QuizTakingPage;