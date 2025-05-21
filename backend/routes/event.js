// routes/event.js

const express = require("express");
const router = express.Router();
const Event = require("../models/Eventi");
const jwt = require("jsonwebtoken");

router.post("/api/events", async (req, res) => {
  try {
    const { nome, descrizione, data, ora, postiDisponibili, luogo, tipoEvento, tipoVisibilita } = req.body;

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
      tipoEvento,
      tipoVisibilita
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
  const token = req.headers.authorization?.split(" ")[1];
  let userId = null;

  try {
    if (token) {
      const decoded = jwt.verify(token, 'betn_secret_123');
      userId = decoded.id;
    }

    const evento = await Event.findById(req.params.id).lean();
    if (!evento) return res.status(404).json({ message: "Evento non trovato" });

    const giàIscritto = userId && evento.iscritti?.some(id => id.toString() === userId);

    res.json({
      ...evento,
      giàIscritto
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore del server" });
  }
});

router.post("/event/:id/iscriviti", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Non autorizzato" });

  try {
    const decoded = jwt.verify(token, 'betn_secret_123');
    const userId = decoded.id;

    const evento = await Event.findById(req.params.id);
    if (!evento) return res.status(404).json({ message: "Evento non trovato" });

    // Controllo iscrizione singola per utente
    if (evento.iscritti.includes(userId)) {
      return res.status(400).json({ message: "Utente già iscritto" });
    }

    if (evento.postiOccupati >= evento.postiDisponibili) {
      return res.status(400).json({ message: "Posti esauriti" });
    }

    evento.postiOccupati += 1;
    evento.iscritti.push(userId);
    await evento.save();

    res.json({ message: "Iscrizione completata" });
  } catch (err) {
    res.status(403).json({ message: "Token non valido" });
  }
});

router.get("/eventi", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  let isAutenticato = false;
  if (token) {
    try {
      jwt.verify(token, "betn_secret_123");
      isAutenticato = true;
    } catch (err) {
      isAutenticato = false;
    }
  }

  const query = isAutenticato ? {} : { tipoVisibilita: "pubblico" };

  try {
    const eventi = await Event.find(query, "nome data luogo tipoVisibilita");
    res.json(eventi);
  } catch (err) {
    res.status(500).json({ message: "Errore nel recupero degli eventi." });
  }
});

module.exports = router;

