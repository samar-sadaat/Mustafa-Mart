// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
});

store.subscribe(() => {
  try {
    localStorage.setItem("cart", JSON.stringify(store.getState().cart));
  } catch (error) {
    console.error("Failed to save cart:", error);
  }
});