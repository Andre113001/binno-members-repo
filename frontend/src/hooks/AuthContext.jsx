// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);  
  const [memberId, setMemberId] = useState(null); // Add memberId state

  const login = () => {
    // Perform your authentication logic
    // Set authenticated to true if authentication is successful
    setAuthenticated(true);
    console.log("Authentication: " + authenticated);
  };

  const logout = () => {
    // Perform logout logic
    // Set authenticated to false and memberId to null
    setAuthenticated(false);
    setMemberId(null);
    console.log("Authentication: " + authenticated);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, memberId, setMemberId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
