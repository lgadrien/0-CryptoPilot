import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./cryptos.db', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

export const getPrices = (req, res) => {
    const query = 'SELECT * FROM prices';

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching prices:', err);
            res.status(500).json({ error: 'Failed to fetch prices' });
        } else {
            res.json(rows);
        }
    });
};