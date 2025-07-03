import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ReactMarkdown from 'react-markdown';

const AiAssistantPage = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');
        setIsLoading(true);

        try {
            const { data } = await axios.post('http://localhost:8080/api/ai/chat', { prompt: currentInput });
            const aiMessage = { sender: 'ai', text: data.response };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            const errorMessage = { sender: 'ai', text: 'Sorry, I encountered an error. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
            console.error('AI chat request failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f7f7f7' }}>
            <Navbar />
            <div style={{ flex: 1, padding: '1rem', overflowY: 'auto' }}>
                {messages.map((msg, index) => (
                    <div key={index} style={{
                        display: 'flex',
                        justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        marginBottom: '1rem'
                    }}>
                        <div style={{
                            maxWidth: '70%',
                            padding: '0.5rem 1rem',
                            borderRadius: '18px',
                            background: msg.sender === 'user' ? '#dcf8c6' : 'white',
                            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
                            overflowWrap: 'break-word', // Helps with long words or code
                        }}>
                            {/* FIX: Explicitly convert the message text to a string to prevent errors */}
                            <ReactMarkdown>
                                {String(msg.text || '')}
                            </ReactMarkdown>
                        </div>
                    </div>
                ))}
                {isLoading && <div style={{textAlign: 'center', color: '#888'}}>AI is thinking...</div>}
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '1rem', background: '#eee' }}>
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask the AI Assistant..."
                    style={{ flex: 1, padding: '0.75rem', border: '1px solid #ccc', borderRadius: '20px' }}
                    disabled={isLoading}
                />
                <button type="submit" style={{ padding: '0.5rem 1.5rem', marginLeft: '0.5rem', borderRadius: '20px', background: '#007bff', color: 'white', border: 'none' }} disabled={isLoading}>
                    Send
                </button>
            </form>
        </div>
    );
};

export default AiAssistantPage;