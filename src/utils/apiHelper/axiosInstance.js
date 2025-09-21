import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://cyapay.ddns.net/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  config => {
    console.log('API Request:', config.url, config.data);
    return config;
  },
  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.log('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
