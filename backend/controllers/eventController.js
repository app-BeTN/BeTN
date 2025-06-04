const createError = require('http-errors');
const eventService = require('../services/eventService');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Funzione d’appoggio che, se c’è Header “Authorization: Bearer <token>”, restituisce l’ID,
 * altrimenti null.
 */
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

/**
 * iscrivitiController:
 *  - req.params.id → ID evento
 *  - Authorization: Bearer <token> → dal token prendo userId
 *  - Chiama eventService.iscrivitiEvent(eventId, userId)
 *  - In caso di successo, restituisce 200 con un JSON di conferma
 */
async function iscrivitiController(req, res, next) {
  try {
    const eventId = req.params.id;
    const userId = getUserIdFromHeader(req);

    const updatedEvent = await eventService.iscrivitiEvent(eventId, userId);
    // Puoi restituire solo un messaggio di conferma, o i dati aggiornati:
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
    // Errori inaspettati
    return next(err);
  }
}

module.exports = {
  createEventController,
  listEventsController,
  getEventController,
  iscrivitiController
};
