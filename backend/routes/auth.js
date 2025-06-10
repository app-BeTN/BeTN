const express = require('express');
const { signupController } = require('../controllers/authController');
const { loginController } = require('../controllers/authController');
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');
const Utente = require('../models/Utenti');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { authRequired }      = require('../middleware/auth');
const { updateController }  = require('../controllers/authController');
const { query, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const { checkEmail } = require('../controllers/authController');
const { checkTipo } = require('../controllers/authController');
const router = express.Router();





// rate limiter: max 10 richieste al minuto per IP
const emailLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Too many requests, please try again later.' }
});

// POST /api/signup
router.post('/api/signup', validateEmail, validatePassword, signupController);

// POST /api/login
router.post('/api/login', loginController);


// GET /api/check-nome (case-insensitive)
router.get('/api/check-nome', async (req, res) => {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ message: 'Nome è obbligatorio' });
  }

  // escape eventuali metacaratteri e crea regex case-insensitive
  const escaped = nome.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex   = new RegExp(`^${escaped}$`, 'i');

  // cerca nel DB senza badare al maiuscolo/minuscolo
  const existing = await Utente.findOne({ nome: regex });

  // existing = trovato → nome non disponibile
  if (existing) {
    return res.json({ esiste: false });
  }
  // non trovato → nome disponibile
  return res.json({ esiste: true });
});

//get /api/check-email
router.get('/api/check-email', authRequired, checkEmail);

router.get('/api/check-tipo', authRequired, checkTipo);
//get /api/me
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

//router.put aggiorna l'utente
router.put('/api/me',authRequired,
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
