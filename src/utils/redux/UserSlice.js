import { createSlice } from '@reduxjs/toolkit';

const UserSlice = createSlice({
  name: 'UserSlice',
  initialState: {
    selectedBank: null,
    token: null,
  },
  reducers: {
    setSelectedBank: (state, action) => {
      state.selectedBank = action.payload;
    },
    clearSelectedBank: state => {
      state.selectedBank = null;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    clearToken: state => {
      state.token = null;
    },
  },
});

export const { setSelectedBank, clearSelectedBank, setToken, clearToken } =
  UserSlice.actions;
export default UserSlice.reducer;
