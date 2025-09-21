import axiosInstance from './axiosInstance';

export const loginUser = async token => {
  try {
    const response = await axiosInstance.post(`/login`, { token });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Something went wrong' };
  }
};
