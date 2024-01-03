import { useState, useEffect } from 'react';

const useAccessToken = () => {
  const [isTokenPresent, setIsTokenPresent] = useState(null);

  useEffect(() => {
    // Check if the access token is present in localStorage
    const accessToken = localStorage.getItem('access');

    // Update the state based on the presence of the access token
    setIsTokenPresent(accessToken);
  }, []); // Empty dependency array ensures that this effect runs once on component mount

  return isTokenPresent;
};

export default useAccessToken;
