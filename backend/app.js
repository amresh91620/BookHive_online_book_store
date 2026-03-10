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

const defaultOrigins = [
  "http://localhost:5173",
  "https://book-hive-online-book-store.vercel.app",
  "https://book-hive-online-book-store-858ahai9t-amresh91620s-projects.vercel.app",
];
const allowedOrigins = (process.env.CLIENT_ORIGIN || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isDev = process.env.NODE_ENV !== "production";
const allowAll = process.env.ALLOW_ALL_ORIGINS === "true";
const isDevOrigin = (origin) =>
  /^https?:\/\/localhost:\d+$/.test(origin) ||
  /^https?:\/\/127\.0\.0\.1:\d+$/.test(origin);
const isVercelProjectOrigin = (origin) =>
  /^https:\/\/book-hive-online-book-store(-[a-z0-9-]+)?\.vercel\.app$/.test(origin);

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        allowAll ||
        !origin ||
        origin === "null" ||
        allowedOrigins.includes(origin) ||
        isVercelProjectOrigin(origin) ||
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
