// src/store/slices/TransactionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactionsById: {}, // map by transaction_id (for dedupe if needed)
  sections: [], // SectionList style grouped data [{ title, total, data: [...] }]
  flatList: [], // flattened array if you want sequential list (optional)
  page: 1,
  lastPage: 1,
  total: 0,
  per_page: 20,
  isLoading: false,
  isLoadingMore: false,
  error: null,
};

const TransactionSlice = createSlice({
  name: 'TransactionSlice',
  initialState,
  reducers: {
    startLoading: state => {
      state.isLoading = true;
      state.error = null;
    },
    finishLoading: state => {
      state.isLoading = false;
      state.error = null;
    },
    startLoadingMore: state => {
      state.isLoadingMore = true;
      state.error = null;
    },
    finishLoadingMore: state => {
      state.isLoadingMore = false;
      state.error = null;
    },
    setTransactionsPage: (state, action) => {
      // payload: { sections, page, lastPage, total, per_page }
      const { sections, page, lastPage, total, per_page } = action.payload;
      // replace
      state.sections = sections;
      state.page = page;
      state.lastPage = lastPage;
      state.total = total;
      state.per_page = per_page;
      // update flatList
      state.flatList = sections.flatMap(s => s.data);
      state.isLoading = false;
      state.isLoadingMore = false;
      state.error = null;
    },
    appendTransactionsPage: (state, action) => {
      // payload: { sections, page, lastPage, total, per_page }
      const { sections, page, lastPage, total, per_page } = action.payload;

      // merge sections by title (month)
      const merged = [];
      const existingByTitle = {};
      state.sections.forEach(s => (existingByTitle[s.title] = { ...s }));

      sections.forEach(newS => {
        if (existingByTitle[newS.title]) {
          // append data
          existingByTitle[newS.title].data = existingByTitle[
            newS.title
          ].data.concat(newS.data);
          // update total (sum amounts if provided) - we'll try to recalc
        } else {
          existingByTitle[newS.title] = { ...newS };
        }
      });

      // convert back to array preserving original order + new months appended at end
      const titlesOrder = Object.keys(existingByTitle);
      titlesOrder.forEach(t => merged.push(existingByTitle[t]));

      state.sections = merged;
      state.page = page;
      state.lastPage = lastPage;
      state.total = total;
      state.per_page = per_page;
      state.flatList = merged.flatMap(s => s.data);
      state.isLoading = false;
      state.isLoadingMore = false;
      state.error = null;
    },
    clearTransactions: state => {
      state.sections = [];
      state.flatList = [];
      state.page = 1;
      state.lastPage = 1;
      state.total = 0;
      state.per_page = 20;
      state.isLoading = false;
      state.isLoadingMore = false;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isLoadingMore = false;
    },
  },
});

export const {
  startLoading,
  finishLoading,
  startLoadingMore,
  finishLoadingMore,
  setTransactionsPage,
  appendTransactionsPage,
  clearTransactions,
  setError,
} = TransactionSlice.actions;

export default TransactionSlice.reducer;
