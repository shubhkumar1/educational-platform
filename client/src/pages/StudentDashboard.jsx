import Navbar from '../components/Navbar';

const StudentDashboard = () => {
  return (
    <div>
      <Navbar userRole="student" />
      <h2>Student Dashboard</h2>
      <p>Welcome, Student!</p>
    </div>
  );
};

export default StudentDashboard;