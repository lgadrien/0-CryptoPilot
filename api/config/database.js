import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

// Configuration du pool de connexions PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'cryptopilot',
  password: process.env.DB_PASSWORD || 'cryptopilot123',
  database: process.env.DB_NAME || 'cryptopilot',
  max: 20, // Nombre maximum de connexions dans le pool
  idleTimeoutMillis: 30000, // Temps avant fermeture d'une connexion inactive
  connectionTimeoutMillis: 2000, // Timeout de connexion
});

// Test de la connexion
pool.on('connect', () => {
  console.log('✅ Connecté à PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erreur PostgreSQL inattendue:', err);
  process.exit(-1);
});

// Fonction helper pour exécuter des requêtes
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('📊 Requête exécutée', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('❌ Erreur de requête:', error);
    throw error;
  }
};

export default pool;
