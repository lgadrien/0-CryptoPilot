import express from 'express';
import pricesRoutes from './Prices.js';

const router = express.Router();

// Use the prices routes
router.use('/prices', pricesRoutes);

export default router;