import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', background: '#eee', padding: '1rem', marginBottom: '1rem' }}>
      <h1>Educational Platform</h1>
      <div>
        {user && (
          <>
            <span style={{ marginRight: '1rem' }}>Welcome, {user.name}</span>
            <button onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;