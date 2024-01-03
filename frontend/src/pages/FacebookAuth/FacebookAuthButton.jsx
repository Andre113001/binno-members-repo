import React from 'react';
import axios from 'axios';

const FacebookAuthButton = () => {
    const handleLogin = async () => {
        try {
            const response = await axios.get('/api/fb/auth');
            // Handle the response accordingly, e.g., redirect to the returned URL
            window.location.href = response.data.redirectUrl;
        } catch (error) {
            console.error('Facebook login error:', error);
        }
    };
    
    return (
    <button onClick={handleLogin}>Login with Facebook</button>
    );
}

export default FacebookAuthButton
