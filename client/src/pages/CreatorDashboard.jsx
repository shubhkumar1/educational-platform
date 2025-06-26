import Navbar from '../components/Navbar';

const CreatorDashboard = () => {
  return (
    <div>
      <Navbar userRole="creator" />
      <h2>Creator Dashboard</h2>
      <p>Welcome, Creator!</p>
    </div>
  );
};

export default CreatorDashboard;