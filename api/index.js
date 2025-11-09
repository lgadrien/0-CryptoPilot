import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/database.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ===========================
// Middlewares
// ===========================
app.use(cors({
  origin: 'http://localhost:5173', // Frontend Vite
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger simple
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`);
  next();
});

// ===========================
// Routes
// ===========================

// Route de test
app.get('/', (req, res) => {
  res.json({
    message: '🚀 CryptoPilot API v1.0',
    status: 'active',
    timestamp: new Date().toISOString(),
  });
});

// Test de connexion à la base de données
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// Routes API
app.use('/api/users', userRoutes);

// ===========================
// Gestion des erreurs 404
// ===========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route introuvable',
    path: req.path,
  });
});

// ===========================
// Gestion des erreurs globales
// ===========================
app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// ===========================
// Démarrage du serveur
// ===========================
app.listen(PORT, () => {
  console.log('\n🚀 ========================================');
  console.log(`   CryptoPilot API`);
  console.log('   ========================================');
  console.log(`   🌐 Serveur : http://localhost:${PORT}`);
  console.log(`   📊 Health  : http://localhost:${PORT}/health`);
  console.log(`   👥 Users   : http://localhost:${PORT}/api/users`);
  console.log('   ========================================\n');
});

// Gestion propre de l'arrêt
process.on('SIGINT', async () => {
  console.log('\n🛑 Arrêt du serveur...');
  await pool.end();
  process.exit(0);
});
