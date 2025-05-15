const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');
const Utente = require('../models/Utenti');
const secretKey = 'betn_secret_123';

router.post('/api/signup', async (req, res) => {
    const { nome, email, password, tipo, azienda } = req.body;

    const esistente = await Utente.findOne({ $or: [{ nome }, { email }] });
    if (esistente) {
      return res.status(409).json({ message: 'Nome utente o email già registrati' });
    }

    try {
      const hashed = await bcrypt.hash(password, 10);
      const nuovoUtente = new Utente({
        nome,
        email,
        password: hashed,
        tipo,
        azienda: azienda || null
      });

      await nuovoUtente.save();
      
      const token = jwt.sign({ id: nuovoUtente._id }, secretKey, { expiresIn: '1h' });

      res.status(201).json({ token });
    } catch (error) {
      console.error('Errore signup:', error);
      res.status(500).json({ message: 'Errore durante la registrazione' });
    }
  });

// Info utente (protezione con JWT)
router.get('/api/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token mancante' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, secretKey);
    const utente = await Utente.findById(payload.id);
    if (!utente) return res.status(404).json({ message: 'Utente non trovato' });

    res.json({ nome: utente.nome });
  } catch (err) {
    res.status(401).json({ message: 'Token non valido' });
  }
});

router.get('/api/check-nome', async (req, res) => {
  const nome = req.query.nome;
  if (!nome) return res.status(400).json({ esiste: false });

  const utente = await Utente.findOne({ nome });
  return res.json({ esiste: !!utente });
});

module.exports = router;
