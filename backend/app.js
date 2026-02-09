const express = require('express');
const cors = require('cors')
const app = express();
const authRouter = require('./Routes/authRoutes');
const adminRouter =require('./Routes/adminRoutes');
const bookRouter =require('./Routes/bookRoutes');
const reviewRouter =require('./Routes/reviewRoutes');
const cartRouter =require('./Routes/cartRoutes');

app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
// Middleware
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// Routes
app.use('/api/users',authRouter);
app.use("/api/books", bookRouter);
app.use('/api/admin',adminRouter);
app.use("/api/reviews",reviewRouter);
app.use("/api/cart", cartRouter);

module.exports = app;