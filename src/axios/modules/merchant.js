import axiosInstance from '../axiosInstance';

export const getMerchant = async storeId => {
  try {
    const response = await axiosInstance.get(`/v1/store/${storeId}`);
    return response.data;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};