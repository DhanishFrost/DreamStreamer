import axios from 'axios';
import getJWTToken from './getJWTToken';

const API_URL = import.meta.env.VITE_API_URL;

// Function to fetch popular albums
export const fetchPopularAlbums = async () => {
  try {
    const response = await axios.get(`${API_URL}/popular-content?type=popularAlbums`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular albums:', error);
    throw error;
  }
};

// Function to fetch popular tracks
export const fetchPopularTracks = async () => {
  try {
    const response = await axios.get(`${API_URL}/popular-content?type=popularTracks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular tracks:', error);
    throw error;
  }
};

// Function to fetch popular artists
export const fetchPopularArtists = async () => {
  try {
    const response = await axios.get(`${API_URL}/popular-content?type=popularArtists`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular artists:', error);
    throw error;
  }
};

// Function to fetch popular Genres
export const fetchPopularGenres = async () => {
  try {
    const response = await axios.get(`${API_URL}/popular-content?type=popularGenres`);
    return response.data;
  } catch (error) {
    console.error('Error fetching popular genres:', error);
    throw error;
  }
};

// Function to post TrackPlay
export const recordTrackPlay = async (trackId) => {
  try {
      const token = await getJWTToken();
      const response = await axios.post(
          `${API_URL}/popular-content`, 
          { trackId }, 
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          }
      );
      return response.data;
  } catch (error) {
      console.error('Error recording track play:', error);
      throw error;
  }
};
