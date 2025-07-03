import React from 'react';

const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '8px',
    maxWidth: '500px',
    textAlign: 'center',
};

const PublishWarning = ({ isOpen, onClose, onConfirm, flaggedKeywords }) => {
    if (!isOpen) return null;

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <h2 style={{ color: '#dc3545' }}>Content Warning</h2>
                <p>Our system has detected potentially problematic keywords in your content. Publishing content that violates our policies may result in your account being suspended.</p>
                <div style={{ margin: '1rem 0', background: '#f8f9fa', padding: '0.5rem', borderRadius: '4px' }}>
                    <p><strong>Flagged Keywords:</strong> {flaggedKeywords.join(', ')}</p>
                </div>
                <p>Please review your content. Do you still wish to proceed?</p>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-around' }}>
                    <button onClick={onClose} style={{ padding: '0.5rem 1.5rem' }}>Review Content</button>
                    <button onClick={onConfirm} style={{ padding: '0.5rem 1.5rem', background: '#dc3545', color: 'white', border: 'none' }}>
                        Publish Anyway
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PublishWarning;