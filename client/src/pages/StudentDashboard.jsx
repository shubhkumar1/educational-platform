import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import UsageTracker from '../components/UsageTracker';

const StudentDashboard = () => {
  return (
    <div>
      <Navbar />
      <div style={{ padding: '1rem' }}>
        <UsageTracker />
        <h2>Student Dashboard</h2>
        <p>Welcome, Student!</p>
        <div style={{display: 'flex', gap: '1rem', marginTop: '1rem'}}>
          <Link to="/blogs">Read Blogs</Link>
          <Link to="/videos">Watch Videos</Link>
          <Link to="/quizzes">Take a Quiz</Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;