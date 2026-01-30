const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");



const getAllUsers = async (req, res) => {
    try {
        const user = await User.findAll({ 
            attributes: { exclude: ['password'] } 
        });
        return res.json({ 
            user, 
            message: "Users fetched successfully" 
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
};

const getProfile = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });
        
        if (!user) {
            return res.status(404).json({ 
                message: "User not found" 
            });
        }
        
        return res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "User fetched successfully by id"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching user by id",
            error: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password, role } = req.body;
        
        // Find user
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if username already exists (for different user)
        if (username) {
            const isExistingUser = await User.findOne({ where: { username } });
            if (isExistingUser && isExistingUser.id !== user.id) {
                return res.status(400).json({ 
                    message: "Username already exists" 
                });
            }
        }

        // Check if email already exists (for different user)
        if (email) {
            const isExistingEmail = await User.findOne({ where: { email } });
            if (isExistingEmail && isExistingEmail.id !== user.id) {
                return res.status(400).json({ 
                    message: "Email already exists" 
                });
            }
        }

        // Hash password if provided
        let hashedPassword = user.password;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update user
        await user.update({
            username: username || user.username,
            email: email || user.email,
            password: hashedPassword,
            role: role || user.role
        });

        return res.status(200).json({
            message: "User updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error updating user",
            error: error.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }
        
        await user.destroy();
        
        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error deleting user",
            error: error.message
        });
    }
};

const getActiveUsers = async (req, res) => {
    res.json({ 
        message: "This is to get all active users request" 
    });
};

module.exports = {
    getAllUsers,
    getProfile,
    updateProfile,
    deleteUser,
    getActiveUsers
};