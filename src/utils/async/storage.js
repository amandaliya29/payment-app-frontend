import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_DATA_KEY = 'user_data';

export const saveUserData = async userData => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (e) {
    console.error('Error saving user data:', e);
  }
};

export const getUserData = async () => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error getting user data:', e);
    return null;
  }
};

export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (e) {
    console.error('Error removing user data:', e);
  }
};
