const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");

/* ================= OTP TEMP STORE ================= */
const otpStore = {};
const passwordResetOtpStore = {};

/* ===================================================
   STEP 1: SEND OTP FOR REGISTRATION
=================================================== */
exports.sendRegisterOtp = async (req, res) => {
  const { email } = req.body || {};

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ msg: "Valid email is required" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ msg: "Email already registered" });
    }

    const otp = generateOTP();

    otpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
      verified: false,
    };

    await sendEmail({
      email,
      subject: "Book Store Email Verification",
      message: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

/* ===================================================
   FORGOT PASSWORD: SEND OTP
=================================================== */
exports.sendForgotPasswordOtp = async (req, res) => {
  const { email } = req.body || {};

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ msg: "Valid email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not registered" });
    }

    // Prevent admin password reset via forgot password
    if (user.role === "admin") {
      return res.status(403).json({ msg: "Admin password cannot be reset via this method. Please contact support." });
    }

    const otp = generateOTP();

    passwordResetOtpStore[email] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 min
    };

    await sendEmail({
      email,
      subject: "Book Store Password Reset",
      message: `Your password reset OTP is ${otp}. It expires in 5 minutes.`,
    });

    res.json({ msg: "OTP sent to your email" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to send OTP" });
  }
};

/* ===================================================
   FORGOT PASSWORD: RESET
=================================================== */
exports.resetPassword = async (req, res) => {
  const { email, otp, password, confirmPassword } = req.body || {};

  try {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ msg: "Valid email is required" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const record = passwordResetOtpStore[email];

    if (!record) {
      return res.status(400).json({ msg: "OTP not requested" });
    }

    if (record.expiresAt < Date.now()) {
      delete passwordResetOtpStore[email];
      return res.status(400).json({ msg: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not registered" });
    }

    // Prevent admin password reset via forgot password
    if (user.role === "admin") {
      delete passwordResetOtpStore[email];
      return res.status(403).json({ msg: "Admin password cannot be reset via this method. Please contact support." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    delete passwordResetOtpStore[email];

    res.json({ msg: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Password reset failed" });
  }
};

/* ===================================================
   STEP 2: VERIFY OTP
=================================================== */
exports.verifyRegisterOtp = async (req, res) => {
  const { email, otp } = req.body || {};

  try {
    if (!email || !otp) {
      return res.status(400).json({ msg: "Email and OTP are required" });
    }

    const record = otpStore[email];

    if (!record) {
      return res.status(400).json({ msg: "OTP not requested or expired" });
    }

    if (record.expiresAt < Date.now()) {
      delete otpStore[email];
      return res.status(400).json({ msg: "OTP expired. Please request a new one" });
    }

    // Convert both to string and trim for comparison
    const storedOtp = String(record.otp).trim();
    const providedOtp = String(otp).trim();

    if (storedOtp !== providedOtp) {
      console.log("OTP mismatch:", { stored: storedOtp, provided: providedOtp });
      return res.status(400).json({ msg: "Invalid OTP. Please check and try again" });
    }

    record.verified = true;

    res.json({ msg: "Email verified successfully" });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ msg: "OTP verification failed" });
  }
};

/* ===================================================
   STEP 3: REGISTER USER
=================================================== */
exports.register = async (req, res) => {
    const { name, email, password, confirmPassword, phone } = req.body || {};

  try {
    const record = otpStore[email];

    if (!record || !record.verified) {
      return res.status(400).json({ msg: "Email verification required" });
    }

    if (!name || name.length < 3) {
      return res.status(400).json({ msg: "Name must be at least 3 characters" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ msg: "Password must be at least 6 characters" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      phone: phone ? String(phone).trim() : undefined,
    });

    delete otpStore[email];

    res.status(201).json({
      msg: "Account created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Registration failed" });
  }
};

/* ===================================================
   LOGIN
=================================================== */
exports.login = async (req, res) => {
  const { email, password } = req.body || {};

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not registered" });
    }

    if (!user.isVerified) {
      return res.status(401).json({ msg: "Please verify your email first" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ msg: "Your account is blocked. Contact support." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        profileImage: user.profileImage || "",
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};


/* ===================================================
   CHANGE PASSWORD (Authenticated User)
=================================================== */
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body || {};

  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ msg: "New password must be at least 6 characters" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ msg: "New passwords do not match" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Current password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to change password" });
  }
};
