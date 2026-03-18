const supabase = require('../db');

const getStats = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [
            { count: totalBooks },
            { count: borrowedBooks },
            { count: activeLoans },
            { count: overdueLoans },
            { count: pendingReservations },
            { count: totalUsers }
        ] = await Promise.all([
            supabase.from('livre').select('*', { count: 'exact', head: true }),
            supabase.from('exemplaire').select('*', { count: 'exact', head: true }).eq('disponibilite', false),
            // Active loans: loans not yet returned (date_retour_reelle IS NULL)
            supabase.from('emprunt').select('*', { count: 'exact', head: true }).is('date_retour_reelle', null),
            // Overdue loans: active loans past due date (date_retour_reelle IS NULL AND date_retour_prevue < today)
            supabase.from('emprunt').select('*', { count: 'exact', head: true })
                .is('date_retour_reelle', null)
                .lt('date_retour_prevue', today),
            supabase.from('reservation').select('*', { count: 'exact', head: true }).eq('statut', 'EN_ATTENTE'),
            supabase.from('utilisateur').select('*', { count: 'exact', head: true })
        ]);

        const availableBooks = (totalBooks || 0) - (borrowedBooks || 0);

        res.json({
            totalBooks: totalBooks || 0,
            availableBooks,
            borrowedBooks: borrowedBooks || 0,
            activeLoans: activeLoans || 0,
            overdueLoans: overdueLoans || 0,
            pendingReservations: pendingReservations || 0,
            totalUsers: totalUsers || 0
        });

    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = {
    getStats
};
