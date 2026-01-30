const { User, Transaction, Category } = require("../models");
const { sequelize } = require("../database/db");
const { Op } = require("sequelize");

// Get Admin Dashboard Stats
exports.getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.count();

        // Total transactions
        const totalTransactions = await Transaction.count();

        // Stats for recent user growth (optional)
        const recentUsers = await User.count({
            where: {
                createdAt: {
                    [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
                }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalTransactions,
                recentUsers
            }
        });
    } catch (error) {
        console.error("Admin dashboard stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch admin dashboard stats",
            error: error.message
        });
    }
};

// Get Category Usage Stats
exports.getCategoryStats = async (req, res) => {
    try {
        // Get transaction counts grouped by category
        const stats = await Transaction.findAll({
            attributes: [
                'category',
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
            ],
            group: ['category'],
            order: [[sequelize.literal('count'), 'DESC']]
        });

        // Top 5 categories
        const topCategories = stats.slice(0, 5);
        // Least 5 categories
        const leastCategories = stats.slice(-5).reverse();

        res.status(200).json({
            success: true,
            data: {
                allStats: stats,
                topCategories,
                leastCategories
            }
        });
    } catch (error) {
        console.error("Admin category stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch category stats",
            error: error.message
        });
    }
};
// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { username: { [Op.iLike]: `%${search}%` } },
                { fullName: { [Op.iLike]: `%${search}%` } }
            ];
        }

        const { count, rows } = await User.findAndCountAll({
            where: whereClause,
            attributes: { exclude: ['password'] },
            order: [['username', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                totalUsers: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            }
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent admin from deleting themselves
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot delete yourself" });
        }

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await user.destroy();
        res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ success: false, message: "Failed to delete user" });
    }
};

// Toggle user role (Admin only)
exports.toggleUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Prevent admin from changing their own role
        if (user.id === req.user.id) {
            return res.status(400).json({ success: false, message: "You cannot change your own role" });
        }

        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        res.status(200).json({
            success: true,
            message: `User role updated to ${user.role}`,
            data: user
        });
    } catch (error) {
        console.error("Toggle user role error:", error);
        res.status(500).json({ success: false, message: "Failed to update user role" });
    }
};
