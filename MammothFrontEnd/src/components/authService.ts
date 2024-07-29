import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8082';

export const googleAuth = () => {
    // Redirect the user to the backend endpoint that initiates Google OAuth
    window.location.href = `https://mammothbackend.vercel.app/api/auth/google`;
};

export const getHome = async () => {
    
    try {
        const response = await axios.get(`${apiBaseUrl}/home`);
        return response.data;
        
    } catch (error) {
        console.error('Get home failed', error);
        return { success: false };
    }
};
