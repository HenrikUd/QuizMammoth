import axios from 'axios';

// Use the proxy prefix
const API_URL = '/api/auth';

export const googleAuth = () => {
    // Redirect the user to the backend endpoint that initiates Google OAuth
    window.location.href = `${API_URL}/google`;
};

export const getHome = async () => {
    
    try {
        const response = await axios.get(`${API_URL}/home`);
        return response.data;
        
    } catch (error) {
        console.error('Get home failed', error);
        return { success: false };
    }
};
