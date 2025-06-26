import React, { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [usageDetails, setUsageDetails] = useState(null);
  const usageInterval = useRef(null);
  const navigate = useNavigate();

  const tickUsageApi = async () => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/usage/tick');
      setUsageDetails(data);
    } catch (error) {
      console.error('Usage tick failed:', error);
      if (error.response && error.response.status === 403) {
        stopUsageTracking();
      }
    }
  };

  const startUsageTracking = () => {
    if (usageInterval.current) return;
    console.log("Starting usage tracking...");
    tickUsageApi();
    usageInterval.current = setInterval(tickUsageApi, 60000);
  };

  const stopUsageTracking = () => {
    console.log("Stopping usage tracking.");
    clearInterval(usageInterval.current);
    usageInterval.current = null;
  };

  const login = async (googleToken, deviceId) => {
    try {
      const { data } = await axios.post('http://localhost:8080/api/auth/google', {
        googleToken,
        deviceId,
      });

      const mockUser = { role: 'student', name: 'Test Student' };
      setUser(mockUser);
      setSessionId(data.sessionId);
      
      const mockSubscription = { status: 'free_tier', usage: 0, limit: 200 };
      setUsageDetails(mockSubscription);
      
      if (mockSubscription.status === 'free_tier') {
        startUsageTracking();
      }
      
      navigate(`/${mockUser.role}/dashboard`);
    } catch (error) {
      console.error("Login API call failed:", error);
      alert("Login failed. Please try again.");
    }
  };

  const logout = async () => {
    stopUsageTracking();
    try {
      await axios.post('http://localhost:8080/api/auth/logout', { sessionId });
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      setUser(null);
      setUsageDetails(null);
      setSessionId(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    return () => stopUsageTracking();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, usageDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);