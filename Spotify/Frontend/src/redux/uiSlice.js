import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toasts: [],
  },
  reducers: {
    addToast: (state, action) => {
      // action.payload: { id, message, type: 'success' | 'error', duration }
      state.toasts.push(action.payload);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { addToast, removeToast } = uiSlice.actions;

// Helper thunk to auto-dismiss toasts after a duration (default 4000ms)
export const showToast = ({ message, type = 'success', duration = 4000 }) => (dispatch) => {
  const id = Date.now().toString() + Math.random().toString(36).substring(2, 7);
  dispatch(addToast({ id, message, type, duration }));
  setTimeout(() => {
    dispatch(removeToast(id));
  }, duration);
};

export default uiSlice.reducer;
