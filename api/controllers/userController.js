import pool from '../config/database.js';
import bcrypt from 'bcrypt';

// 🔍 GET - Récupérer tous les utilisateurs
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users ORDER BY created_at DESC'
    );
    
    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    console.error('❌ Erreur getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des utilisateurs',
      error: error.message,
    });
  }
};

// 🔍 GET - Récupérer un utilisateur par ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} introuvable`,
      });
    }
    
    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Erreur getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de l\'utilisateur',
      error: error.message,
    });
  }
};

// ✏️ POST - Créer un nouvel utilisateur
export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validation des champs
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont requis (name, email, password)',
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé',
      });
    }
    
    // Hasher le mot de passe
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Créer l'utilisateur
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email, hashedPassword]
    );
    
    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Erreur createUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de l\'utilisateur',
      error: error.message,
    });
  }
};

// 🔄 PUT - Mettre à jour un utilisateur
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    
    // Vérifier si l'utilisateur existe
    const userExists = await pool.query(
      'SELECT id FROM users WHERE id = $1',
      [id]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} introuvable`,
      });
    }
    
    // Construire la requête dynamiquement
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (name) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }
    
    if (email) {
      // Vérifier si l'email n'est pas déjà utilisé par un autre user
      const emailCheck = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé par un autre utilisateur',
        });
      }
      
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updates.push(`password = $${paramCount}`);
      values.push(hashedPassword);
      paramCount++;
    }
    
    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Aucun champ à mettre à jour',
      });
    }
    
    // Ajouter updated_at automatique
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING id, name, email, updated_at
    `;
    
    const result = await pool.query(query, values);
    
    res.status(200).json({
      success: true,
      message: 'Utilisateur mis à jour avec succès',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('❌ Erreur updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour de l\'utilisateur',
      error: error.message,
    });
  }
};

// 🗑️ DELETE - Supprimer un utilisateur
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Vérifier si l'utilisateur existe
    const userExists = await pool.query(
      'SELECT id, name FROM users WHERE id = $1',
      [id]
    );
    
    if (userExists.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Utilisateur avec l'ID ${id} introuvable`,
      });
    }
    
    // Supprimer l'utilisateur (CASCADE supprime aussi portfolio et transactions)
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    
    res.status(200).json({
      success: true,
      message: `Utilisateur "${userExists.rows[0].name}" supprimé avec succès`,
    });
  } catch (error) {
    console.error('❌ Erreur deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression de l\'utilisateur',
      error: error.message,
    });
  }
};
