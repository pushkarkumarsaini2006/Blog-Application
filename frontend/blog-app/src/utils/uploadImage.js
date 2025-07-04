import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance'; 

const uploadImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error('No image file provided');
  }

  const formData = new FormData();
  // Append image file to form data
  formData.append('image', imageFile); 

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set header for file upload
      },
      timeout: 30000, // 30 second timeout for image upload
    });
    
    return response.data; // Return response data
  } catch (error) {
    console.error('Error uploading the image:', error); 
    if (error.response) {
      console.error('Upload error response:', error.response.data);
    }
    throw error; // Rethrow error for handling
  }
};

export default uploadImage;
