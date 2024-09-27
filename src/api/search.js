import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTracksBySearch = async (searchTerm) => {
  try {
    const response = await axios.get(`${API_URL}/search`, {
      params: { searchTerm },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tracks:', error);
    throw error;
  }
};
