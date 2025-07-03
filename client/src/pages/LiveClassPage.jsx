import React from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

const LiveClassPage = () => {
    const { videoId } = useParams();

    return (
        <div>
            <Navbar />
            <div style={{ padding: '1rem' }}>
                <h2>Live Class is in Session</h2>
                <div className="video-player" style={{ maxWidth: '900px', margin: 'auto' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                        <iframe
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube Live Class"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
                <div style={{ maxWidth: '900px', margin: '1rem auto' }}>
                    <h3>Live Chat (Placeholder)</h3>
                    <div style={{ border: '1px solid #ccc', height: '300px', padding: '1rem' }}>
                        Chat integration will appear here.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveClassPage;