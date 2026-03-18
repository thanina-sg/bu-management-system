const { getReservations, createReservation, updateReservation, deleteReservation } = require('../models/reservationModel');

const getAllReservations = async (req, res) => {
    try {
        const currentRole = req.user?.role;
        const currentUserId = req.user?.id;

        const filters = {
            studentId: req.query.id_utilisateur,
            status: req.query.statut,
        };

        if (
            currentRole !== 'BIBLIOTHECAIRE' &&
            currentRole !== 'ADMINISTRATEUR'
        ) {
            filters.studentId = currentUserId;
        }

        const reservations = await getReservations(filters);
        res.json(reservations);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const createNewReservation = async (req, res) => {
    try {
        const currentRole = req.user?.role;
        const currentUserId = req.user?.id;
        const { id_utilisateur, isbn } = req.body;

        const canCreateForOthers =
            currentRole === 'BIBLIOTHECAIRE' || currentRole === 'ADMINISTRATEUR';
        const ownerId = canCreateForOthers ? (id_utilisateur || currentUserId) : currentUserId;

        const reservation = await createReservation(ownerId, isbn);
        res.status(201).json(reservation);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const updateReservationStatus = async (req, res) => {
    try {
        const currentRole = req.user?.role;
        const currentUserId = req.user?.id;
        const { statut } = req.body;

        const allReservations = await getReservations({});
        const reservation = allReservations.find((r) => String(r.id) === String(req.params.id));

        if (!reservation) {
            return res.status(404).json({ error: 'Réservation introuvable' });
        }

        const isStaff = currentRole === 'BIBLIOTHECAIRE' || currentRole === 'ADMINISTRATEUR';
        const isOwner = String(reservation.id_utilisateur) === String(currentUserId);

        if (!isStaff && !isOwner) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

        if (!isStaff && statut !== 'ANNULEE') {
            return res.status(403).json({ error: 'Un usager peut seulement annuler sa réservation' });
        }

        const updatedReservation = await updateReservation(req.params.id, statut);
        res.json(updatedReservation);

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

const cancelReservation = async (req, res) => {
    try {
        const currentRole = req.user?.role;
        const currentUserId = req.user?.id;

        const allReservations = await getReservations({});
        const reservation = allReservations.find((r) => String(r.id) === String(req.params.id));

        if (!reservation) {
            return res.status(404).json({ error: 'Réservation introuvable' });
        }

        const isStaff = currentRole === 'BIBLIOTHECAIRE' || currentRole === 'ADMINISTRATEUR';
        const isOwner = String(reservation.id_utilisateur) === String(currentUserId);

        if (!isStaff && !isOwner) {
            return res.status(403).json({ error: 'Accès interdit' });
        }

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
