import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

// Mock Data: In the future, this would come from our backend API.
const mockVideos = [
  { id: 'jfKfPfyJRdk', title: 'lofi hip hop radio 📚 - beats to relax/study to' },
  { id: 'M_XwzB9AbUo', title: 'Calculus 1 - Full College Course' },
  { id: '8j_A-g22w6A', title: 'Organic Chemistry - Full Course' },
  { id: 'k9W_j5lG3Q0', title: 'Python for Beginners - Full Course' }
];

const VideoListPage = () => {
  // State to hold the currently selected video ID. Default to the first video.
  const [selectedVideoId, setSelectedVideoId] = useState(mockVideos[0].id);

  return (
    <div>
      <Navbar />
      <div style={{ display: 'flex', padding: '1rem' }}>
        {/* Video Player Section */}
        <div style={{ flex: 3, marginRight: '1rem' }}>
          <h2>Now Playing</h2>
          <div className="video-player" style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
              src={`https://www.youtube.com/embed/${selectedVideoId}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Playlist Section */}
        <div style={{ flex: 1, borderLeft: '1px solid #ccc', paddingLeft: '1rem' }}>
          <h3>Video Playlist</h3>
          {mockVideos.map(video => (
            <div
              key={video.id}
              onClick={() => setSelectedVideoId(video.id)}
              style={{
                padding: '0.5rem',
                margin: '0.5rem 0',
                cursor: 'pointer',
                backgroundColor: selectedVideoId === video.id ? '#ddd' : 'transparent'
              }}
            >
              {video.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoListPage;