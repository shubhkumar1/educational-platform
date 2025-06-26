import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  return (
    <div>
      <Navbar userRole="admin" />
      <h2>Admin Dashboard</h2>
      <p>Welcome, Admin!</p>
    </div>
  );
};

export default AdminDashboard;