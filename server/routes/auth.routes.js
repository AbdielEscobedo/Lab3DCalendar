const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');

const router = express.Router();
const JWT_SECRET = 'supersecretkey_dev_only'; // In prod, use .env

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, matricula, password } = req.body;
        const existingUser = await User.findOne({ where: { matricula } });
        if (existingUser) {
            return res.status(400).json({ error: 'Matricula already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            matricula,
            password: hashedPassword,
            role: 'student' // Default to student
        });

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { matricula, password } = req.body;
        const user = await User.findOne({ where: { matricula } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, name: user.name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({ token, user: { id: user.id, name: user.name, role: user.role, matricula: user.matricula } });
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

module.exports = router;
