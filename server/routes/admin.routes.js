const express = require('express');
const { Reservation, Equipment, sequelize } = require('../models');

const router = express.Router();

// Middleware to ensure admin
const isAdmin = (req, res, next) => {
    // Debug log
    console.log('Admin Check:', req.user);
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Require Admin Role' });
    }
    next();
};

router.use(isAdmin);

// Statistics
router.get('/stats', async (req, res) => {
    try {
        // Fetch all equipment to ensure we list even those with 0 usage
        const allEquipment = await Equipment.findAll({ raw: true });

        // Fetch stats grouped by equipment
        const stats = await Reservation.findAll({
            attributes: [
                'equipmentId',
                [sequelize.fn('COUNT', sequelize.col('id')), 'usageCount'],
                [sequelize.fn('SUM', sequelize.col('materialUsed')), 'totalMaterial']
            ],
            group: ['equipmentId'],
            raw: true
        });

        // Merge stats into equipment list
        const equipmentStats = allEquipment.map(eq => {
            const stat = stats.find(s => s.equipmentId === eq.id);
            return {
                Equipment: eq, // Keep structure expected by frontend
                usageCount: stat ? stat.usageCount : 0,
                totalMaterial: stat ? stat.totalMaterial : 0,
                equipmentId: eq.id
            };
        });

        // Sort by usage count desc
        equipmentStats.sort((a, b) => b.usageCount - a.usageCount);

        res.json({ equipmentStats });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching stats' });
    }
});

module.exports = router;
