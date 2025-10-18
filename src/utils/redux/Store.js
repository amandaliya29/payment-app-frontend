import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './UserSlice'; // default export from your slice

export const Store = configureStore({
  reducer: {
    user: UserReducer, // key can be 'user' or anything you like
  },
});
