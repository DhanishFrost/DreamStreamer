import axios from 'axios';
import getJWTToken from './getJWTToken';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchRecentlyPlayed = async () => {
    try {
        const token = await getJWTToken();
        const response = await axios.get(`${API_URL}/recently-played`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching recently played tracks:', error);
        throw error;
    }
};
