const express = require('express');
const { Reservation, Equipment, User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Middleware to extract user from token (mocked for now, need actual middleware)
// In a real app we would use a middleware function. 
// For this MVP, we will assume req.user is populated by a middleware in index.js

// Create Reservation
router.post('/', async (req, res) => {
    try {
        const { equipmentId, startTime, endTime, materialUsed } = req.body;
        const userId = req.user.id; // Assumes auth middleware

        // Validate Input
        if (!equipmentId || !startTime || !endTime) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        if (start >= end) {
            return res.status(400).json({ error: 'Start time must be before end time' });
        }

        // Check for Overlaps
        const overlap = await Reservation.findOne({
            where: {
                equipmentId,
                status: { [Op.ne]: 'cancelled' },
                [Op.or]: [
                    {
                        startTime: {
                            [Op.lt]: end
                        },
                        endTime: {
                            [Op.gt]: start
                        }
                    }
                ]
            }
        });

        if (overlap) {
            return res.status(409).json({ error: 'Equipment is already booked for this time slot' });
        }

        const reservation = await Reservation.create({
            userId,
            equipmentId,
            startTime: start,
            endTime: end,
            materialUsed,
            status: 'confirmed'
        });

        res.status(201).json(reservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating reservation' });
    }
});

// List Reservations
router.get('/', async (req, res) => {
    try {
        const { userId } = req.query;
        const whereClause = {};

        // If student, can only see own? Or all to see schedule?
        // Requirement: "Calendario Visual: ... donde se vean los bloques de tiempo ocupados"
        // So public/students need to see ALL confirmed reservations to know what is busy.
        // They shouldn't see WHO booked it maybe, but for this MVP we'll return basics.

        // If filtering by specific user (e.g. "My Reservations")
        if (userId) {
            whereClause.userId = userId;
        }

        const reservations = await Reservation.findAll({
            where: whereClause,
            include: [
                { model: Equipment, attributes: ['name', 'type', 'id'] },
                { model: User, attributes: ['name', 'matricula'] } // Maybe hide this for non-admins?
            ]
        });

        res.json(reservations);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching reservations' });
    }
});

// Cancel Reservation
router.put('/:id/cancel', async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const userRole = req.user.role;

        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({ error: 'Reservation not found' });
        }

        // Only owner or admin can cancel
        if (reservation.userId !== userId && userRole !== 'admin') {
            return res.status(403).json({ error: 'Unauthorized' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        res.json({ message: 'Reservation cancelled' });
    } catch (error) {
        res.status(500).json({ error: 'Error cancelling reservation' });
    }
});

module.exports = router;
