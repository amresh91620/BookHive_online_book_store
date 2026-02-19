const express = require('express');
const cors = require('cors')
const app = express();
const authRouter = require('./Routes/authRoutes');
const adminRouter =require('./Routes/adminRoutes');
const bookRouter =require('./Routes/bookRoutes');
const reviewRouter =require('./Routes/reviewRoutes');
const cartRouter =require('./Routes/cartRoutes');
const wishlistRouter = require("./Routes/wishlistRoutes");
const addressRouter = require("./Routes/addressRoutes");
const orderRouter = require("./Routes/orderRoutes");

const allowedOrigins = (process.env.CLIENT_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isDev = process.env.NODE_ENV !== "production";
const allowAll = process.env.ALLOW_ALL_ORIGINS === "true";
const isDevOrigin = (origin) =>
  /^https?:\/\/localhost:\d+$/.test(origin) ||
  /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        allowAll ||
        !origin ||
        origin === "null" ||
        allowedOrigins.includes(origin) ||
        isDevOrigin(origin) ||
        (isDev && origin)
      ) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
// Middleware
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Routes
app.use('/api/users',authRouter);
app.use("/api/books", bookRouter);
app.use('/api/admin',adminRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);

module.exports = app;
