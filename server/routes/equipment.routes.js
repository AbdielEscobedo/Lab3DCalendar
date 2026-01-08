const express = require('express');
const { Equipment } = require('../models');

const router = express.Router();

// Get all equipment
router.get('/', async (req, res) => {
    try {
        const equipment = await Equipment.findAll();
        res.json(equipment);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching equipment' });
    }
});

module.exports = router;
