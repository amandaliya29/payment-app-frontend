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
{
  console.log("🔔 updateFcmToken api call");
  console.log("🔔 FCM Token:", fcm_token);
  
  try {
    const response = await axios.post('/user/fcm/update', { fcm_token });
    console.log("✅ FCM token updated successfully:", response.data);
    return response;
  } catch (error) {
    console.log("❌ FCM token update failed:", error.response?.data || error.message);
    throw error;
  }
}

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

export const getResentTransfer = async () =>
  await axios.get(`/transactions/recent-users`);

export const getBankDetail = async payload =>
  await axios.post(`/bank/account/get`, payload);

export const getSearchIfsc = async () => await axios.get(`/bank/ifsc/search`);

export const getNBFCDetail = async () =>
  await axios.get(`/credit-upi/npci/details`);

export const NBFCActive = async payload =>
  await axios.post(`/credit-upi/npci-activate`, payload);

export const NBFCSetPin = async payload =>
  await axios.post(`/credit-upi/npci/save/pin`, payload);

export const PayToBank = async payload =>
  await axios.post('/pay-bank', payload);

export const updatePin = async payload =>
  await axios.post('/bank/save/pin', payload);

export const updateCreditUpiPin = async payload =>
  await axios.post('/credit-upi/update/pin', payload);

export const updateNbfcPincode = async payload =>
  await axios.post('/credit-upi/npci/update/pin', payload);
