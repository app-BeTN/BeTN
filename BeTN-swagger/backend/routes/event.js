const express = require('express');
const Event = require('../models/Eventi');
const router = express.Router();

// Modifica evento
router.put('/event/:id', async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  try {
    const event = await Event.findByIdAndUpdate(id, updateData, { new: true });
    if (!event) return res.status(404).json({ message: 'Evento non trovato' });
    res.json(event);
  } catch (err) {
    res.status(400).json({ message: 'Dati non validi', error: err.message });
  }
});

// Elimina evento
router.delete('/event/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return res.status(404).json({ message: 'Evento non trovato' });
    res.json({ message: 'Evento eliminato correttamente' });
  } catch (err) {
    res.status(500).json({ message: 'Errore server', error: err.message });
  }
});

module.exports = router;