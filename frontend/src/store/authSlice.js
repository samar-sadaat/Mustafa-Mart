import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  loading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = !!action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.isAuth = false;
      state.loading = false;
    },
    stopLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { setUser, logout, stopLoading } = authSlice.actions;
export default authSlice.reducer;