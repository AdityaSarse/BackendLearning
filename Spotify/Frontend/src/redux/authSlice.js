import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showToast } from './uiSlice';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/auth/register', userData);
      
      dispatch(
        showToast({
          message: response.data.message || 'Registration successful! Welcome to SoundWave.',
          type: 'success',
        })
      );
      
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';
      
      dispatch(
        showToast({
          message: errMsg,
          type: 'error',
        })
      );
      
      return rejectWithValue(errMsg);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/auth/login', loginData);
      
      dispatch(
        showToast({
          message: response.data.message || 'Login successful! Welcome back.',
          type: 'success',
        })
      );
      
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please check your credentials.';
      
      dispatch(
        showToast({
          message: errMsg,
          type: 'error',
        })
      );
      
      return rejectWithValue(errMsg);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/auth/logout');
      dispatch(
        showToast({
          message: response.data.message || 'Logged out successfully.',
          type: 'success',
        })
      );
      return response.data;
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.message ||
        'Logout failed.';
      return rejectWithValue(errMsg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        localStorage.setItem('user', JSON.stringify(state.user));
        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        localStorage.removeItem('user');
        state.success = false;
        state.error = null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
