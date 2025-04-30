// controllers/visitorController.js
import pool from '../config/db.js';

export const recordVisit = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Coba insert terlebih dahulu. Jika gagal karena duplikat key, lakukan update.
        try {
            await pool.execute(
                'INSERT INTO visitors (visit_date, visit_count) VALUES (?, 1)',
                [today]
            );
            res.status(200).json({ message: 'Kunjungan pertama hari ini tercatat' });
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                // Jika error adalah duplicate entry, lakukan update
                await pool.execute(
                    'UPDATE visitors SET visit_count = visit_count + 1 WHERE visit_date = ?',
                    [today]
                );
                res.status(200).json({ message: 'Jumlah kunjungan hari ini diperbarui' });
            } else {
                // Jika error bukan duplicate entry, lempar error
                console.error('Gagal mencatat kunjungan:', error);
                res.status(500).json({ message: 'Gagal mencatat kunjungan' });
            }
        }

    } catch (error) {
        console.error('Gagal mencatat kunjungan (outer catch):', error);
        res.status(500).json({ message: 'Gagal mencatat kunjungan' });
    }
};

export const getTodayVisitors = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const [visitors] = await pool.execute(
            'SELECT visit_count FROM visitors WHERE visit_date = ?',
            [today]
        );

        if (visitors.length > 0) {
            res.status(200).json({ visitors: visitors[0].visit_count });
        } else {
            res.status(200).json({ visitors: 0 });
        }

    } catch (error) {
        console.error('Gagal mendapatkan jumlah pengunjung hari ini:', error);
        res.status(500).json({ message: 'Gagal mendapatkan jumlah pengunjung hari ini' });
    }
};

export const getTotalVisitors = async (req, res) => {
    try {
        const [totalVisitorsResult] = await pool.execute(
            'SELECT SUM(visit_count) AS total_visitors FROM visitors'
        );

        if (totalVisitorsResult.length > 0 && totalVisitorsResult[0].total_visitors !== null) {
            res.status(200).json({ totalVisitors: totalVisitorsResult[0].total_visitors });
        } else {
            res.status(200).json({ totalVisitors: 0 });
        }

    } catch (error) {
        console.error('Gagal mendapatkan total pengunjung:', error);
        res.status(500).json({ message: 'Gagal mendapatkan total pengunjung' });
    }
};