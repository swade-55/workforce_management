// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import toolReducer from '../slices/toolSlice';
import authReducer from '../slices/authSlice'

const store = configureStore({
  reducer: {
    tools: toolReducer,
    auth: authReducer,
  },
});

export default store;
