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

export const CreditUpiBankList = async () => {
  try {
    const response = await axiosInstance.get('/credit-upi/bank/list');
    // optional: log for debugging
    console.log('Credit/UPI Bank List:', response.data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: 'Failed to fetch credit/UPI bank list',
      }
    );
  }
};

export const scanBankQr = async image => {
  try {
    // Create form data for the image upload
    const formData = new FormData();
    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'qr_image.jpg',
      type: image.type || 'image/jpeg',
    });

    const response = await axiosInstance.post('/bank/qr/scan', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data; // expected { status: true, data: { code: 'https://...' }, messages: 'Fetch successfully' }
  } catch (error) {
    console.log('QR Scan Error:', error);
    throw error.response?.data || { message: 'Failed to scan QR code' };
  }
};

export const activateCreditUpi = async (token, bank_account) => {
  try {
    const response = await axiosInstance.post('/credit-upi/activate', {
      token,
      bank_account,
    });
    console.log('Credit UPI Activation Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Full Axios Error:', error.toJSON ? error.toJSON() : error);
    throw error.response?.data || { message: 'Failed to activate credit UPI' };
  }
};

export const saveCreditUpiPin = async (
  bank_credit_upi,
  pin_code,
  pin_code_confirmation,
) => {
  try {
    const response = await axiosInstance.post('/credit-upi/save/pin', {
      bank_credit_upi,
      pin_code,
      pin_code_confirmation,
    });
    console.log('Save Credit UPI Pin Response:', response.data);
    return response.data;
  } catch (error) {
    console.log('Save Credit UPI Pin Error:', error);
    throw (
      error.response?.data || {
        message: 'Failed to save credit UPI pin',
      }
    );
  }
};

export const searchUser = async search => {
  try {
    const response = await axiosInstance.post('/user/search', { search });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search user' };
  }
};
