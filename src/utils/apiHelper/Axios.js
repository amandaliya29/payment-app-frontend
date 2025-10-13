import axiosInstance from './axiosInstance';
import { removeUserData } from '../async/storage';

export const loginUser = async (token, fcm_token) => {
  try {
    const response = await axiosInstance.post(`/login`, { token, fcm_token });
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

export const updateFcmToken = async fcm_token => {
  try {
    const response = await axiosInstance.post('/user/fcm/update', {
      fcm_token,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update FCM token' };
  }
};

export const BankList = async () => {
  try {
    const response = await axiosInstance.get('/bank/list');
    // console.log(response.data);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'error' };
  }
};

export const saveBankDetails = async payload => {
  try {
    const response = await axiosInstance.post('/bank/details', payload);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to save bank details' };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await axiosInstance.get('/user/profile');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

export const getBankAccountList = async () => {
  try {
    const response = await axiosInstance.get('/bank/account/list');
    // optional: you can log it for debugging
    console.log('Bank Account List:', response.data);
    return response.data; // returns object with status, data[], messages
  } catch (error) {
    throw (
      error.response?.data || { message: 'Failed to fetch bank account list' }
    );
  }
};

export const getBankBalance = async (bank_id, pin_code) => {
  try {
    const response = await axiosInstance.post('/bank/balance', {
      account_id: bank_id,
      pin_code,
    });
    // response example: { status: true, data: { amount: "0.00" }, messages: "Fetch successfully" }
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch bank balance' };
  }
};
