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


    const merchant = data?.user;

    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.accessToken, data?.token?.accessToken?.token);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.refreshToken, data?.token?.refreshToken?.token);
    await AppAsyncStorage.storeData(AppAsyncStorage.STORAGE_KEYS.merchant, JSON.stringify(merchant));
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.storeId,
      merchant?.workingStore,
    );
    await AppAsyncStorage.storeData(
      AppAsyncStorage.STORAGE_KEYS.phoneNumber,
      phoneNumber,
    );
    return data;
  } catch (error) {
    console.log('Error', error);
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get("/auth/profile");

    return response.data
  } catch (error) {
    console.log("error:", error); // debug
    throw error;
  }
};


