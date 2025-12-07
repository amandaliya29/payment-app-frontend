import axios from 'axios';
import { getUserData, removeUserData } from '../async/storage';

export const BASE_URL = 'https://cyapay.ddns.net/api';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async config => {
    try {
      // Wait for async storage value
      const userData = await getUserData();
      console.log('🔍 Interceptor - userData:', userData);
      console.log('🔍 Interceptor - token:', userData?.token);

      if (userData?.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
        console.log('✅ Authorization header set:', config.headers.Authorization);
      } else {
        console.log('❌ No token found in userData');
      }
    } catch (e) {
      console.log('Error getting token:', e);
    }

    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response && error.response.status === 401) {
      removeUserData();
    }
    console.log('API Error:', error.response?.data || error.message);
    console.log('axios error:',error.response);
    return Promise.reject(error);
  },
);

export default axiosInstance;
