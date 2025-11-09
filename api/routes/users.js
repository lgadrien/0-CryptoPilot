import express from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// Routes CRUD pour les utilisateurs
router.get('/', getAllUsers);           // GET /api/users
router.get('/:id', getUserById);        // GET /api/users/:id
router.post('/', createUser);           // POST /api/users
router.put('/:id', updateUser);         // PUT /api/users/:id
router.delete('/:id', deleteUser);      // DELETE /api/users/:id

export default router;
