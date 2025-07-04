import { API_PATHS } from './apiPaths';
import axiosInstance from './axiosInstance'; 

const uploadImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error('No image file provided');
  }

  const formData = new FormData();
  // Append image file to form data
  formData.append('image', imageFile); 

  console.log('Uploading image:', { 
    name: imageFile.name, 
    size: imageFile.size, 
    type: imageFile.type 
  }); // Debug log

  try {
    const response = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData, {
      headers: {
        'Content-Type': 'multipart/form-data', // Set header for file upload
      },
      timeout: 30000, // 30 second timeout for image upload
    });
    
    console.log('Image upload response:', response.data); // Debug log
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
