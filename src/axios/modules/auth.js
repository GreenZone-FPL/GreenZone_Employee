import { AppAsyncStorage } from '../../utils';
import axiosInstance from '../axiosInstance';

export const login = async ({ phoneNumber, password }) => {
  try {
    const response = await axiosInstance.post('/auth/login', { phoneNumber, password });
    const { data } = response;
    console.log('>>>>>>>>>>>>>>>>', JSON.stringify(data, null, 2));
    return response.data;
  } catch (error) {
    console.log('Lỗi gọi API Login:', error);
    throw error;
  }
};


export const login2 = async ({ phoneNumber, password }) => {
  try {
    const response = await axiosInstance.post('/auth/login', { phoneNumber, password });
    const { data } = response;
    console.log('>>>>>>>>>>>>>>>>', JSON.stringify(data, null, 2));

    const merchant = data?.user
    const accessToken = data?.token?.accessToken?.token;
    const refreshToken = data?.token?.refreshToken?.token;
    const storeId = merchant?.workingStore;


    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.accessToken, accessToken);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.refreshToken, refreshToken);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.merchant, merchant);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.storeId, storeId);


    return response.data;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};
