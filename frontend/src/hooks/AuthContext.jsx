// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);  

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
    console.log("Authentication: " + authenticated);
  };

  return (
    <AuthContext.Provider value={{ authenticated, login, logout, }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
