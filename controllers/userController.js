const User = require('../model/User_model');
const { createError, successMessage } = require('../utils/ResponseMessage');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Create new user
const createUser = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user with same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return createError(res, 400, "User with this email already exists");
        }

        // If the requested role is admin (role === 0)
        if (role === 0) {
            // Check if an admin already exists
            const existingAdmin = await User.findOne({ role: 0 });
            if (existingAdmin) {
                return createError(res, 400, "Admin already exists. Only one admin is allowed.");
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const user = new User({
            username,
            email,
            password: hashedPassword,
            role
        });

        const savedUser = await user.save();

        // Create JWT token
        const token = jwt.sign(
            { userId: savedUser._id, role: savedUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const userResponse = savedUser.toObject();
        delete userResponse.password;

        return successMessage(res, { user: userResponse, token }, "User created successfully");

    } catch (error) {
        console.error("Error creating user:", error);
        return createError(res, 500, `Error creating user: ${error.message}`);
    }
};

// Sign in user
const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return createError(res, 404, "User not found");
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return createError(res, 401, "Invalid password");
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;

        return successMessage(res, { user: userResponse, token }, "Sign in successful");

    } catch (error) {
        console.error("Error signing in:", error);
        return createError(res, 500, `Error signing in: ${error.message}`);
    }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); // Exclude password field
        return successMessage(res, users, "Users retrieved successfully");
    } catch (error) {
        console.error("Error fetching users:", error);
        return createError(res, 500, `Error fetching users: ${error.message}`);
    }
};

module.exports = {
    createUser,
    signIn,
    getAllUsers
};
