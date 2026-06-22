import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showToast } from './uiSlice';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('/api/user/register', userData);
      
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

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
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
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || action.payload;
        state.success = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
