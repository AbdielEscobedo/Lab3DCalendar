const express = require('express');
const cors = require('cors');
const { syncDatabase } = require('./models');
const authRoutes = require('./routes/auth.routes');
const equipmentRoutes = require('./routes/equipment.routes');
const reservationRoutes = require('./routes/reservation.routes');
const adminRoutes = require('./routes/admin.routes');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'supersecretkey_dev_only';

// Middleware
app.use(cors());
app.use(express.json());

// Auth Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (req.path.startsWith('/api/auth')) return next(); // Skip for auth routes

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Routes
app.use('/api/auth', authRoutes);

// Protected Routes
app.use(authenticateToken);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

// Start
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await syncDatabase();
});
