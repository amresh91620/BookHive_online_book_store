import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import booksReducer from "./slices/booksSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import ordersReducer from "./slices/ordersSlice";
import addressReducer from "./slices/addressSlice";
import reviewsReducer from "./slices/reviewsSlice";
import adminReducer from "./slices/adminSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
    address: addressReducer,
    reviews: reviewsReducer,
    admin: adminReducer,
  },
});

export default store;
