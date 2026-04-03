const express = require('express');
const cors = require('cors')
const compression = require('compression');
const app = express();
const authRouter = require('./Routes/authRoutes');
const adminRouter =require('./Routes/adminRoutes');
const bookRouter =require('./Routes/bookRoutes');
const reviewRouter =require('./Routes/reviewRoutes');
const cartRouter =require('./Routes/cartRoutes');
const wishlistRouter = require("./Routes/wishlistRoutes");
const addressRouter = require("./Routes/addressRoutes");
const orderRouter = require("./Routes/orderRoutes");
const blogRouter = require("./Routes/blogRoutes");
const blogCommentRouter = require("./Routes/blogCommentRoutes");
const settingsRouter = require("./Routes/settingsRoutes");

const defaultOrigins = [
  "http://localhost:5173",
  "https://book-hive-online-book-store.vercel.app",
  "https://book-hive-online-book-store-858ahai9t-amresh91620s-projects.vercel.app",
];
const normalizeOrigin = (value) => (value ? value.replace(/\/$/, "") : value);
const allowedOrigins = (process.env.CLIENT_ORIGIN || defaultOrigins.join(","))
  .split(",")
  .map((origin) => normalizeOrigin(origin.trim()))
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
      const normalizedOrigin = normalizeOrigin(origin);
      
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin || origin === "null") {
        return callback(null, true);
      }
      
      // Check if origin is allowed
      if (
        allowAll ||
        allowedOrigins.includes(normalizedOrigin) ||
        isVercelProjectOrigin(normalizedOrigin) ||
        isDevOrigin(normalizedOrigin) ||
        (isDev && origin)
      ) {
        return callback(null, true);
      }
      
      // Log rejected origins for debugging
      console.warn(`CORS blocked origin: ${origin}`);
      return callback(new Error(`CORS policy: Origin ${origin} is not allowed`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
// Middleware
app.use(compression());
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint (To prevent Render from sleeping)
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'BookHive Backend is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/users',authRouter);
app.use("/api/books", bookRouter);
app.use('/api/admin',adminRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/address", addressRouter);
app.use("/api/orders", orderRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/blog-comments", blogCommentRouter);
app.use("/api/settings", settingsRouter);

module.exports = app;
