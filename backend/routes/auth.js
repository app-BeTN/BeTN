const express = require('express');
const { registerController } = require('../controllers/authController');
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');
const Utente = require('../models/Utenti');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// POST /api/signup
//   - Esegue validazione email e password (middleware)
//   - Chiama registerController
router.post('/api/signup', validateEmail, validatePassword, registerController);

/**
 * GET /api/check-nome?nome=FOO
 *   - Restituisce { available: false } se esiste già un Utente con nome=FOO
 *   - Altrimenti { available: true }
 */
router.get('/api/check-nome', async (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ message: 'Nome è obbligatorio' });
  }
  const existing = await Utente.findOne({ nome });
  if (existing) {
    return res.json({ available: false });
  }
  return res.json({ available: true });
});

/**
 * GET /api/me
 *   - Se c’è header Authorization valido, restituisce i dati dell’utente (senza password)
 *   - Altrimenti 401
 */
router.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token mancante' });
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Token mancante' });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Utente.findById(payload.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato' });
    }
    return res.json(user);
  } catch (err) {
    return res.status(401).json({ message: 'Token non valido' });
  }
});

module.exports = router;
