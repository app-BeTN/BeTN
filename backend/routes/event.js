// routes/event.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Eventi");

router.post("/api/events", async (req, res) => {
  try {
    const { nome, descrizione, data, ora, postiDisponibili, luogo, tipoEvento } = req.body;

    if (!nome || !descrizione || !data || !ora || !postiDisponibili || !luogo || !tipoEvento) {
      return res.status(400).json({ message: "Tutti i campi sono obbligatori." });
    }

    const newEvent = new Event({
      nome,
      descrizione,
      data,
      ora,
      postiDisponibili,
      luogo,
      tipoEvento
    });

    await newEvent.save();

    res.status(201).json({
      message: "Evento creato con successo!",
      eventId: newEvent._id
    });

  } catch (error) {
    console.error("Errore nella creazione dell'evento:", error);
    res.status(500).json({ message: "Errore del server." });
  }
});

router.get("/event/:id", async (req, res) => {
  const evento = await Event.findById(req.params.id);
  if (!evento) {
    return res.status(404).json({ message: "Evento non trovato." });
  }
  res.json(evento);
});

router.post("/event/:id/iscriviti", async (req, res) => {
  try {
    const evento = await Event.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ message: "Evento non trovato." });
    }

    // Controllo se ci sono ancora posti disponibili
    if (evento.postiOccupati >= evento.postiDisponibili) {
      return res.status(400).json({ message: "Posti esauriti." });
    }

    // Aggiungi un partecipante
    evento.postiOccupati += 1;
    await evento.save();

    res.json({ message: "Iscrizione completata." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server." });
  }
});

module.exports = router;
