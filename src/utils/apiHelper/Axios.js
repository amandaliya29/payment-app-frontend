import axios from './axiosInstance';
import { removeUserData } from '../async/storage';

// export const loginUser = async (token, fcm_token) => {
//   try {
//     const response = await axios.post(`/login`, { token, fcm_token });
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || { message: 'Something went wrong' };
//   }
// };

export const loginUser = async payload => await axios.post(`/login`, payload);

export const logoutUser = async () => {
  let res = await axios.get('/logout');
  await removeUserData();
  return res;
};

export const updateFcmToken = async fcm_token =>
  await axios.post('/user/fcm/update', { fcm_token });

export const BankList = async () => await axios.get('/bank/list');

export const saveBankDetails = async payload =>
  await axios.post('/bank/details', payload);

export const getUserProfile = async () => await axios.get('/user/profile');

export const getBankAccountList = async () =>
  await axios.get('/bank/account/list');

export const getBankBalance = async payload => {
  return await axios.post('/bank/balance', payload);
};

export const CreditUpiBankList = async () =>
  await axios.get('/credit-upi/bank/list');

export const scanBankQr = async image => {
  const formData = new FormData();
  formData.append('image', {
    uri: image.uri,
    name: image.fileName || 'qr_image.jpg',
    type: image.type || 'image/jpeg',
  });

  return await axios.post('/bank/qr/scan', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const activateCreditUpi = async payload =>
  await axios.post('/credit-upi/activate', payload);

export const saveCreditUpiPin = async payload =>
  await axios.post('/credit-upi/save/pin', payload);

export const searchUser = async search =>
  await axios.post('/user/search', { search });

export const getTransaction = async id =>
  await axios.get(`/transaction/get/${id}`);

export const getUser = async identifier =>
  await axios.get(`/user/get/${identifier}`);

export const getPay = async payload => await axios.post('/pay', payload);

export const getTransactions = async (payload, page = 1) =>
  await axios.post(`/transactions?page=${page}`, payload);
