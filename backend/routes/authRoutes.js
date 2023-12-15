const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // ตรวจสอบว่า path นี้ถูกต้องตามโครงสร้างโฟลเดอร์ของคุณ
const router = express.Router();

// ลงทะเบียน User
router.post('/register', async (req, res) => {
    try {
        const { username, firstName, lastName, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        await user.save();
        res.status(201).send("User created");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// เข้าสู่ระบบ
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(400).send("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send("Invalid credentials");
        }

        res.status(200).send("Logged in successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;
