import axios from 'axios';
import getJWTToken from './getJWTToken';
import { uploadFileToS3, deleteFileFromS3 } from './S3FileHandler';


const API_URL = import.meta.env.VITE_API_URL;

// Fetch all albums or with filters applied
export const fetchAlbums = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/albums`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching albums:', error);
    throw error;
  }
};


// Fetch specific album details
export const fetchAlbumDetails = async (albumId) => {
  try {
    const response = await axios.get(`${API_URL}/albums?albumId=${albumId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching album details:', error);
    throw error;
  }
};

export const createAlbum = async (title, releaseYear, artistId, imageFile) => {
  try {
      const token = await getJWTToken();
      console.log('token', token);
      const artworkUrl = await uploadFileToS3(imageFile, 'albums');

      // Create the album with the artwork URL
      const response = await axios.post(
          `${API_URL}/albums`,
          {
              title,
              releaseYear,
              artistId,
              artworkUrl,
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
      console.error('Error creating album:', error);
      throw error;
  }
};

export const editAlbum = async (id, title, releaseYear, artistId, imageFile) => {
  try {
      let oldArtworkUrl = null;
      let artworkUrl = null;
      const token = await getJWTToken();

      if (imageFile) {
          artworkUrl = await uploadFileToS3(imageFile, 'albums');
      }

      // Make the PUT request to update the album
      const response = await axios.put(
          `${API_URL}/albums?id=${id}`,
          {
              id,
              title,
              releaseYear,
              artistId,
              artworkUrl,
          },
          {
              headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
          }
      );

      // If the album was updated successfully and the old image URL was provided, delete the old image from S3
      if (response.status === 200 && response.data.oldArtworkUrl) {
          oldArtworkUrl = response.data.oldArtworkUrl;
          const imageName = oldArtworkUrl.split('/').pop();
          await deleteFileFromS3(imageName, 'albums');
      }

      return response.data;
  } catch (error) {
      console.error('Error editing album:', error);
      throw error;
  }
};

export const deleteAlbum = async (id, artworkUrl) => {
  try {
      const token = await getJWTToken();

      // First, delete the album record from the database
      const response = await axios.delete(`${API_URL}/albums?id=${id}`, {
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
      });

      // If the album was deleted successfully and an image URL was provided, delete the image from S3
      if (response.status === 200 && artworkUrl) {
          const imageName = artworkUrl.split('/').pop();
          await deleteFileFromS3(imageName, 'albums');
      }

      return response.data;
  } catch (error) {
      console.error('Error deleting album:', error);
      throw error;
  }
};