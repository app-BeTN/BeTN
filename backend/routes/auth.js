const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const validateEmail = require('../middleware/validateEmail');
const validatePassword = require('../middleware/validatePassword');
const Utente = require('../models/Utenti');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

//creazione nuovo utente
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

//Cerca utente loggato
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

//Controlla esistenza utente dato il nome
router.get('/api/check-nome', async (req, res) => {
  const nome = req.query.nome;
  if (!nome) return res.status(400).json({ esiste: false });

  const utente = await Utente.findOne({ nome });
  return res.json({ esiste: !!utente });
});

// Modifica utente
router.put('/user/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: 'Dati non validi', error: err.message });
  }
});

// Elimina utente
router.delete('/user/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: 'Utente non trovato' });
    res.json({ message: 'Utente eliminato correttamente' });
  } catch (err) {
    res.status(500).json({ message: 'Errore server', error: err.message });
  }
});

module.exports = router;
