const User = require("../models/auth.model");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");


exports.register = async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }
    try {

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(12)
        const hashedPassword = await bcrypt.hash(password, salt)


        const newUser = new User({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            user: newUser
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
            success: false
        });
    }

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found. Please register first.', success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials', success: false });
        }

        const token = await generateToken(user._id)

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(200).json({
            message: 'Login successful.',
            token,
            success: true,
            user

        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            message: 'Server error during login.',
            success: false
        });
    }
}

exports.logout = async (req, res) => {
    try {
        // Clear the cookie
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "none",
            secure: true,
        });

        res.status(200).json({
            message: 'Logged out successfully',
            success: true
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            message: 'Server error during logout',
            success: false
        });
    }
};