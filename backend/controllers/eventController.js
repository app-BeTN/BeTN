const createError = require('http-errors');
const eventService = require('../services/eventService');
const jwt = require('jsonwebtoken');
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
    const userId = getUserIdFromHeader(req);
    const eventi = await eventService.listEvents(userId);
    return res.json(eventi);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// restituisce un evento dato l'id
async function getEventController(req, res, next) {
  try {
    const { id } = req.params;
    const event = await eventService.getEventById(id);
    return res.json(event);
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

module.exports = {
  createEventController,
  listEventsController,
  getEventController,
  iscrivitiController
};
