import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const CreatorDashboard = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <h2>Creator Dashboard</h2>
        <p>Welcome, Creator!</p>
        <Link to="/creator/blogs/create">
          <button style={{ padding: '0.5rem 1rem' }}>Create New Blog Post</button>
        </Link>
      </div>
    </div>
  );
};

export default CreatorDashboard;