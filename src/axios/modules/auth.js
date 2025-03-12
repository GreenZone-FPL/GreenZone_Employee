import axiosInstance from '../axiosInstance';

export const login = async ({phoneNumber, password}) => {
  try {
    const response = await axiosInstance.post('/auth/login', {
      phoneNumber,
      password,
    });
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Login:', error);
    throw error;
  }
};