const { getReservations, createReservation, updateReservation, deleteReservation } = require('../models/reservationModel');

const getAllReservations = async (req, res) => {
    try {
        const filters = {
            studentId: req.query.studentId,
            status: req.query.status
        };

        const reservations = await getReservations(filters);
        res.json(reservations);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createNewReservation = async (req, res) => {
    try {
        const { studentId, isbn } = req.body;

        const reservation = await createReservation(studentId, isbn);
        res.status(201).json(reservation);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const reservation = await updateReservation(req.params.id, status);
        res.json(reservation);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const cancelReservation = async (req, res) => {
    try {
        await deleteReservation(req.params.id);
        res.sendStatus(204);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getAllReservations,
    createNewReservation,
    updateReservationStatus,
    cancelReservation
};
