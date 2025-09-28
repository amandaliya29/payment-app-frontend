import axiosInstance from './axiosInstance';
import { removeUserData } from '../async/storage';

export const loginUser = async token => {
  try {
    const response = await axiosInstance.post(`/login`, { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};

export const logoutUser = async () => {
  try {
    const response = await axiosInstance.get('/logout');
    await removeUserData();
    return response.data;
  } catch (error) {
    console.log(error);
    throw (
      error.response?.data || { message: 'Something went wrong during logout' }
    );
  }
};
