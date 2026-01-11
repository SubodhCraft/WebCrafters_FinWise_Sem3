const User = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const register = async (req, res) => {
    try {
        let { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        email = email.toLowerCase().trim();

        const isUser = await User.findOne({ 
            where: { username }
        });
        if (isUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const isEmail = await User.findOne({ where: { email } });
        if (isEmail) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // let hashedAnswer1 = null;
        // let hashedAnswer2 = null;
        // let hashedAnswer3 = null;

        // if (securityAnswer1) {
        //     hashedAnswer1 = await bcrypt.hash(securityAnswer1, 10);
        // }

        // if (securityAnswer2) {
        // hashedAnswer2 = await bcrypt.hash(securityAnswer2, 10);
        // }
        // if (securityAnswer3) {
        //     hashedAnswer3 = await bcrypt.hash(securityAnswer3, 10);
        // }
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            role: "user",

            // securityQuestion1: securityQuestion1 || null,
            // securityAnswer1: hashedAnswer1,
            // securityQuestion2: securityQuestion2 || null,
            // securityAnswer2: hashedAnswer2,
            // securityQuestion3: securityQuestion3 || null,
            // securityAnswer3: hashedAnswer3,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                // role: newUser.role,
                
            },
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error registering user",
            error: error.message,
        });
    }
};

module.exports = { register };
