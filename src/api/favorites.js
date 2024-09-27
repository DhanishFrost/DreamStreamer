import axios from 'axios';
import getJWTToken from './getJWTToken';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchFavorites = async () => {
    try {
        const token = await getJWTToken();
        const response = await axios.get(`${API_URL}/favorites`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching favorites:', error);
        return [];
    }
};

export const addFavorite = async (trackId) => {
    try {
        const token = await getJWTToken();
        await axios.post(
            `${API_URL}/favorites`,
            { trackId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error('Error adding favorite:', error);
    }
};

export const removeFavorite = async (trackId) => {
    try {
        const token = await getJWTToken();
        await axios.delete(
            `${API_URL}/favorites`,
            {
                data: { trackId }, 
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            }
        );
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
};

