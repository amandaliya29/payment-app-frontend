import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './UserSlice'; // default export from your slice
import transactionReducer from './TransactionSlice'; // <-- new

export const Store = configureStore({
  reducer: {
    user: UserReducer, // key can be 'user' or anything you like
    transaction: transactionReducer,
  },
});
