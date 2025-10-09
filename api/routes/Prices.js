import express from 'express';
import { getPrices } from '../controller/controller.js';

const router = express.Router();

// Define the route to get prices
router.get('/', getPrices);

export default router;