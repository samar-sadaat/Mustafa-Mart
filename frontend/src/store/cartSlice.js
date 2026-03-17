import { createSlice } from "@reduxjs/toolkit";

const defaultCart = {
  items: [],
  shipping: {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  },
};

const getCartFromStorage = () => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : defaultCart;
  } catch (error) {
    return defaultCart;
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState: getCartFromStorage(),
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find(
        (p) => p.productId === item.productId
      );

      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...item, qty: 1 });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (p) => p.productId !== action.payload
      );
    },

    increaseQty: (state, action) => {
      const item = state.items.find(
        (p) => p.productId === action.payload
      );

      if (item) item.qty += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find(
        (p) => p.productId === action.payload
      );

      if (item && item.qty > 1) {
        item.qty -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.shipping = {};
    },

    setShipping: (state, action) => {
      state.shipping = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  clearCart,
  setShipping,
} = cartSlice.actions;

export default cartSlice.reducer;