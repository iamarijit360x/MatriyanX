// AuthContext.js

import { createContext, useContext, useState, useEffect } from 'react';
import router from 'routes'; // Import your router

// Create context
const AuthContext = createContext();

// Custom hook for using AuthContext
export const useAuth = () => useContext(AuthContext);

// Custom hook for handling localStorage
const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : defaultValue;
  });

  useEffect(() => {
    if (value !== undefined) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [key, value]);

  return [value, setValue];
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

  // Login function
  const login = (data) => {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);
    setIsAuthenticated(true);
    // setLoginAccountID(data?.user?.account_id);
    router.navigate('/history'); 
  };

  // Logout function
  const logout = () => {
    localStorage.clear()
    setIsAuthenticated(false);
    // setLoginAccountID(null);
    router.navigate('/login'); // Navigate to login page after logout
  };

  // Provide authentication context to children
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
