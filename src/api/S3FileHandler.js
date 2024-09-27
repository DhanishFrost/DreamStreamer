import axios from 'axios';
import getJWTToken from './getJWTToken';

const API_URL = import.meta.env.VITE_API_URL;
const S3_BUCKET_NAME = import.meta.env.VITE_S3_BUCKET_NAME;

export const uploadFileToS3 = async (file, folderName) => {
  try {
    const token = await getJWTToken();

    // Request a pre-signed URL from your backend
    const response = await axios.post(
      `${API_URL}/s3FileHandler`,
      {
        fileName: file.name,
        fileType: file.type,
        folderName: folderName,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    const { uploadURL, fileKey } = response.data;

    // Use the pre-signed URL to upload the file directly to S3
    await fetch(uploadURL, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    // Return the uploaded file's S3 URL
    const fileUrl = `https://${S3_BUCKET_NAME}.s3.amazonaws.com/${fileKey}`;
    return fileUrl;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw error;
  }
};


export const deleteFileFromS3 = async (fileUrl, folderName) => {
  try {
    const token = await getJWTToken();

    const response = await axios.delete(
      `${API_URL}/s3FileHandler`,
      {
        data: {
          fileUrl,
          folderName,
        },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    return response.data.message;
  } catch (error) {
    console.error('Error deleting image from S3:', error);
    throw error;
  }
};