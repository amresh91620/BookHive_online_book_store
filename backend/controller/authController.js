const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/User");


exports.userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || name.length < 3) {
            return res.status(400).json({ messege: "Name must be at least 3 characters" });
        }
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            return res.status(400).json({ messege: "Invalid email" });
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ messege: "Password must be at least 6 characters" });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ messege: "Email is already registered" })
        }

        // Hash password
        const hashpsaaword = await bcrypt.hash(password, 10);
        //new user
        const user = await User.create({
            name,
            email,
            password: hashpsaaword,
        });

        res.status(201).json({
            msg: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid email or password" });
        }

        //jwt generate
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            msg: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });     
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};