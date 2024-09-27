import axios from 'axios';
import getJWTToken from './getJWTToken';
import { uploadFileToS3, deleteFileFromS3 } from './S3FileHandler';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchArtists = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/artists`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching artists:', error);
    throw error;
  }
};
 

export const fetchArtistDetails = async (artistId) => {
  try {
    const response = await axios.get(`${API_URL}/artists?artistId=${artistId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching artist details:', error);
    throw error;
  }
};

export const createArtist = async (name, biography, birthDate, imageFile) => {
  try {
    const token = await getJWTToken();
    const artistImageUrl = await uploadFileToS3(imageFile, 'artists');

    // Create the artist with the image URL
    const response = await axios.post(
      `${API_URL}/artists`,
      {
        name,
        biography,
        birthDate: birthDate,
        artistImageUrl: artistImageUrl,
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
    console.error('Error creating artist:', error);
    throw error;
  }
};

export const editArtist = async (id, name, biography, birthDate, imageFile) => {
  try {
    let oldArtistImageUrl = null;
    let artistImageUrl = null;
    const token = await getJWTToken();

    if (imageFile) {
      artistImageUrl = await uploadFileToS3(imageFile, 'artists');
    }

    // Make the PUT request to update the artist
    const response = await axios.put(
      `${API_URL}/artists?id=${id}`,
      {
        id: id,
        name: name,
        biography: biography,
        birthDate: birthDate,
        artistImageUrl: artistImageUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // If the artist was updated successfully and the old image URL was provided, delete the old image from S3
    if (response.status === 200 && response.data.oldArtistImageUrl) {
      oldArtistImageUrl = response.data.oldArtistImageUrl;
      const imageName = oldArtistImageUrl.split('/').pop();
      await deleteFileFromS3(imageName, 'artists');
    }

    return response.data;
  } catch (error) {
    console.error('Error editing artist:', error);
    throw error;
  }
};

export const deleteArtist = async (id, artistImageUrl) => {
  try {
    const token = await getJWTToken();

    // First, delete the artist record from the database
    const response = await axios.delete(`${API_URL}/artists?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // If the artist was deleted successfully and an image URL was provided, delete the image from S3
    if (response.status === 200 && artistImageUrl) {
      const imageName = artistImageUrl.split('/').pop();
      await deleteFileFromS3(imageName, 'artists');
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
};