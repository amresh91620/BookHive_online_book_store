const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    name:{
        type:String,
        required : [true, "Name is required"],
        trim: true,
        minLength: [3, "Name must be at least 3 characters"],
    },
     email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.+-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
        password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    
},
    { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);