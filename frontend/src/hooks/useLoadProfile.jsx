import { useState, useEffect } from 'react';
import useAccessToken from './useAccessToken';
import { useNavigate } from 'react-router-dom';

const useLoadProfile = () => {
  const accessToken = useAccessToken();
  const [profileData, setProfileData] = useState(null); // Initialize state with null
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      // Check if accessToken is truthy before proceeding
      if (accessToken) {
        try {
          const results = await fetch(`/api/member/profile/${accessToken}`);
          const data = await results.json();
          // Save the fetched data to the state
          setProfileData(data[0]);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };

    fetchProfile();
  }, [accessToken]);

  // Return the profileData, so it can be used by the component using this hook
  return { profileData };
};

export default useLoadProfile;
