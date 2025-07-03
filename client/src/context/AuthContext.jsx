import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Add a loading state
  const navigate = useNavigate();
  // We no longer need usage tracking or sessionId state here for this step

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        // Ask the backend if we have a valid session
        const { data } = await axios.get('http://localhost:8080/api/auth/status');
        setUser(data); // If yes, set the user state
      } catch (error) {
        // If we get an error (like 401), it means no valid session
        setUser(null);
      } finally {
        // Stop loading once the check is complete
        setLoading(false);
      }
    };

    checkUserStatus();
  }, []);

  const login = async (googleToken, deviceId) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/google', {
        googleToken,
        deviceId,
      });

      setUser(data); // Set the user data received from the backend

      // --- THIS IS THE FIX ---
      // Check if the user's profile is complete
      if (data.profileCompleted) {
        // If complete, navigate to their role-specific dashboard
        navigate(`/${data.role}/dashboard`);
      } else {
        // If not complete, navigate to the onboarding page to choose a role
        navigate('/onboarding');
      }
      
    } catch (error) {
      console.error("Login API call failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      // Call the backend to clear the cookie
      await axios.post('http://localhost:8080/api/auth/logout');
      // Clear the user state and navigate to login
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout API call failed:", error);
    }
  };

  return (
    // Pass the loading state in the context value
    <AuthContext.Provider value={{ user, setUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);