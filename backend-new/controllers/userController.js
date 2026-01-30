const { User } = require("../models");
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
        const id = req.user.id; // ✅ from JWT

        const user = await User.findByPk(id, {
            attributes: { exclude: ['password'] }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
                profilePicture: user.profilePicture
            }
        });
    } catch (error) {
        console.error("DEBUG: getProfile error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};


const updateProfile = async (req, res) => {
    try {
        const id = req.user.id;
        const { username, fullName, email, phone } = req.body;

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

        await user.update({
            username: username || user.username,
            email: email || user.email,
            fullName: fullName !== undefined ? fullName : user.fullName,
            phone: phone !== undefined ? phone : user.phone,
        });

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                role: user.role,
                profilePicture: user.profilePicture
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

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Incorrect current password" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({ success: false, message: "Failed to change password" });
    }
};

const uploadProfilePicture = async (req, res) => {
    try {
        const userId = req.user.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Update user with new profile picture filename
        const picName = req.file.filename;
        user.profilePicture = picName;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            profilePicture: picName
        });
    } catch (error) {
        console.error("Upload profile picture error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
            error: error.message
        });
    }
};

const deleteOwnAccount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message: "Password is required to delete account"
            });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password"
            });
        }

        // Cloudinary handles deletion if needed via admin API, 
        // but for now we just destroy the user record.

        // Delete user
        await user.destroy();

        res.status(200).json({
            success: false,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("Delete account error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete account"
        });
    }
};

module.exports = {
    getAllUsers,
    getProfile,
    updateProfile,
    deleteUser,
    getActiveUsers,
    changePassword,
    uploadProfilePicture,
    deleteOwnAccount
};
