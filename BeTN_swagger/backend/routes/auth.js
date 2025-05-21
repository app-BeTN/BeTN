const express = require('express');
const User = require('../models/Utenti');
const router = express.Router();

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