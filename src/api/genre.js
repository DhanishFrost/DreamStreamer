import axios from 'axios';
import getJWTToken from './getJWTToken';
import { uploadFileToS3, deleteFileFromS3 } from './S3FileHandler';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchGenres = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/genres`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching Genres:', error);
    throw error;
  }
};


export const fetchGenreTracks = async (genreId) => {
  try {
    const response = await axios.get(`${API_URL}/genres?genreId=${genreId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching genre tracks:', error);
    throw error;
  }
};

export const createGenre = async (name, imageFile) => {
  try {
    const token = await getJWTToken();
    const imageUrl = await uploadFileToS3(imageFile, 'genres');

    // Then, create the genre with the image URL
    const response = await axios.post(
      `${API_URL}/genres`,
      {
        name,
        imageUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error creating genre:', error);
    throw error;
  }
};

export const editGenre = async (id, name, imageFile) => {
  try {
    let oldImageUrl = null;
    let imageUrl = null;
    const token = await getJWTToken();

    if (imageFile) {
      imageUrl = await uploadFileToS3(imageFile, 'genres');
    }

    // Make the PUT request to update the genre
    const response = await axios.put(
      `${API_URL}/genres?id=${id}`,
      {
        id: id,
        name: name,
        imageUrl: imageUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    
    // If the genre was deleted successfully and an image URL was provided, delete the image from S3
    if (response.status === 200 && response.data.oldImageUrl) {
      oldImageUrl = response.data.oldImageUrl; 
      const imageName = oldImageUrl.split('/').pop();
      await deleteFileFromS3(imageName, 'genres');
    }

    return response.data;
  } catch (error) {
    console.error('Error editing genre:', error);
    throw error;
  }
};


export const deleteGenre = async (id, imageUrl) => {
  try {
    const token = await getJWTToken();

    // First, delete the genre record from the database
    const response = await axios.delete(`${API_URL}/genres?id=${id}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // If the genre was deleted successfully and an image URL was provided, delete the image from S3
    if (response.status === 200 && imageUrl) {
      const imageName = imageUrl.split('/').pop();
      await deleteFileFromS3(imageName, 'genres');
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting genre:', error);
    throw error;
  }
};