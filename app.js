const express = require('express');
const app = express();
const authRouter = require('./Routes/authRoutes');
const adminRouter = require('./Routes/adminRoutes');
const bookRouter =require('./Routes/bookRoutes');

// Middleware
app.use(express.json()); 

// Routes
app.use('/api/users',authRouter);
app.use('/api/admin',adminRouter);
app.use("/api/books", bookRoutes);

module.exports = app;