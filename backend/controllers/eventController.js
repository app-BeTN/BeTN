const createError = require('http-errors');
const eventService = require('../services/eventService');
const Utente = require('../models/Utenti');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
require('dotenv').config();

// restituisce l'id utente
function getUserIdFromHeader(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    return payload.id;
  } catch {
    return null;
  }
}

// creazione di un evento
async function createEventController(req, res, next) {
  try {
    const userId = getUserIdFromHeader(req);
    const nuovo = await eventService.createEvent(req.body, userId);
    return res.status(201).json({ eventId: nuovo._id });
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// restituisce tutti gli utenti
async function listEventsController(req, res, next) {
  try {
    const events = await eventService.listEvents(getUserIdFromHeader(req));
    return res.status(200).json(events);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// restituisce "i miei eventi"
async function listMyEventsController(req, res, next) {
  try {
    const userId = getUserIdFromHeader(req);
    const events = await eventService.listMyEvents(userId);
    return res.status(200).json(events);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// restituisce "eventi a cui sei iscritto"
async function listEventIscrittoController(req, res, next) {
  try {
    const userId = getUserIdFromHeader(req);
    const events = await eventService.listEventIscritto(userId);
    return res.status(200).json(events);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// restituisce dettaglio di un singolo evento
async function getEventController(req, res, next) {
  try {
    const id = req.params.id;
    const event = await eventService.getEventById(id);
    return res.status(200).json(event);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// modifica evento
async function updateEventController(req, res, next) {
  try {
    const userId = getUserIdFromHeader(req);
    const id = req.params.id;
    const updated = await eventService.updateEvent(id, req.body, userId);
    return res.status(200).json(updated);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// cancellazione evento
async function deleteEventController(req, res, next) {
  try {
    const userId = getUserIdFromHeader(req);
    const id = req.params.id;
    await eventService.deleteEvent(id, userId);
    return res.status(204).send();
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// iscrizione di un utente all'evento
async function iscrivitiController(req, res, next) {
  try {
    const eventId = req.params.id;
    const userId = getUserIdFromHeader(req);

    const updatedEvent = await eventService.iscrivitiEvent(eventId, userId);
    return res.status(200).json({
      message: 'Iscrizione avvenuta con successo',
      event: {
        id: updatedEvent._id,
        postiOccupati: updatedEvent.postiOccupati,
        postiDisponibili: updatedEvent.postiDisponibili,
        iscrittiCount: updatedEvent.iscritti.length
      }
    });
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// disiscrizione di un utente dall'evento
async function disiscrivitiController(req, res) {
  const userId = req.user.id;
  const eventId = req.params.id;

  try {
    const event = await eventService.getEventById(eventId);
    if (!event) return res.status(404).json({ message: "Evento non trovato." });

    const index = event.iscritti.indexOf(userId);
    if (index === -1) {
      return res.status(400).json({ message: "Non sei iscritto a questo evento." });
    }

    event.iscritti.splice(index, 1);
    // decrementa il numero di utenti iscritti
    event.postiOccupati = Math.max(0, (event.postiOccupati || 0) - 1);

    await event.save();

    // rimuove l'evento anche dalla lista dell'utente
    await Utente.findByIdAndUpdate(userId, {
      $pull: { eventiIscritti: new mongoose.Types.ObjectId(eventId) }
    });

    res.status(200).json({ message: "Disiscrizione avvenuta con successo." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Errore server durante la disiscrizione." });
  }
}


module.exports = {
  createEventController,
  listEventsController,
  listMyEventsController,
  listEventIscrittoController,
  getEventController,
  updateEventController,
  deleteEventController,
  iscrivitiController,
  disiscrivitiController
};
