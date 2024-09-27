import axios from 'axios';
import getJWTToken from './getJWTToken';
import { uploadFileToS3, deleteFileFromS3 } from './S3FileHandler';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTracks = async (filters = {}) => {
  try {
    const response = await axios.get(`${API_URL}/tracks`, { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};


export const createTrack = async (title, genreId, duration, artistIds, albumId, imageFile, songFile) => {
  try {
    const token = await getJWTToken();
    let imageUrl = null;
    let songUrl = null;

    if (imageFile) {
      imageUrl = await uploadFileToS3(imageFile, 'tracks/images');
    }

    if (songFile) {
      songUrl = await uploadFileToS3(songFile, 'tracks/songs');
    }

    const response = await axios.post(
      `${API_URL}/tracks`,
      {
        title,
        genreId,
        duration,
        artistIds,
        albumId,
        imageUrl,
        songUrl,
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
    console.error('Error creating track:', error);
    throw error;
  }
};

export const editTrack = async (id, title, genreId, duration, artistIds, albumId, imageFile, songFile) => {
  try {
    let oldImageUrl = null;
    let oldSongUrl = null;
    let imageUrl = null;
    let songUrl = null;
    const token = await getJWTToken();

    if (imageFile) {
      imageUrl = await uploadFileToS3(imageFile, 'tracks/images');
    }

    if (songFile) {
      songUrl = await uploadFileToS3(songFile, 'tracks/songs');
    }

    // Make the PUT request to update the track
    const response = await axios.put(
      `${API_URL}/tracks?id=${id}`,
      {
        id,
        title,
        genreId,
        duration,
        artistIds,
        albumId,
        imageUrl,
        songUrl,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    // If the track was updated successfully and the old image/song URLs were provided, delete the old files from S3
    if (response.status === 200) {
      if (response.data.oldImageUrl) {
        oldImageUrl = response.data.oldImageUrl;
        const imageName = oldImageUrl.split('/').pop();
        await deleteFileFromS3(imageName, 'tracks/images');
      }

      if (response.data.oldSongUrl) {
        oldSongUrl = response.data.oldSongUrl;
        const songName = oldSongUrl.split('/').pop();
        await deleteFileFromS3(songName, 'tracks/songs');
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error editing track:', error);
    throw error;
  }
};

export const deleteTrack = async (id, imageUrl, songUrl) => {
  try {
    const token = await getJWTToken();
    // First, delete the track record from the database
    const response = await axios.delete(`${API_URL}/tracks?id=${id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    // If the track was deleted successfully, delete the image and song from S3
    if (response.status === 200) {
      if (imageUrl) {
        const imageName = imageUrl.split('/').pop();
        await deleteFileFromS3(imageName, 'tracks/images');
      }

      if (songUrl) {
        const songName = songUrl.split('/').pop();
        await deleteFileFromS3(songName, 'tracks/songs');
      }
    }

    return response.data;
  } catch (error) {
    console.error('Error deleting track:', error);
    throw error;
  }
};



