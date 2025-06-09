const express = require('express');
const { signupController } = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');
const Utente = require('../models/Utenti');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const { authRequired }      = require('../middleware/auth');
const { updateController }  = require('../controllers/authController');


// POST /api/signup
router.post('/api/signup', validateEmail, validatePassword, signupController);

// POST /api/login
router.post('/api/login', loginController);

//GET /api/check-nome
router.get('/api/check-nome', async (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ message: 'Nome è obbligatorio' });
  }
  const existing = await Utente.findOne({ nome });
  if (existing) {
    return res.json({ esiste: false });
  }
  return res.json({ esiste: true });
});

//GET /api/me
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

// PUT /api/me → aggiorna i dati dell'utente loggato
// layers: authRequired → validazione parti modificate → controller
router.put(
  '/api/me',
  authRequired,
  // se modifichi email o password riusa i tuoi middleware:
  (req, res, next) => { 
    if (req.body.email)    validateEmail(req, res, next);
    else                    next();
  },
  (req, res, next) => {
    if (req.body.password) validatePassword(req, res, next);
    else                   next();
  },
  updateController
);
module.exports = router;
