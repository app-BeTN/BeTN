const createError = require('http-errors');
const Evento = require('../models/Eventi');

// creazione evento
async function createEvent(dataPayload, userId) {
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }
  const {
    nome,
    descrizione,
    data,
    ora,
    postiDisponibili,
    luogo,
    tipoEvento,
    tipoVisibilita
  } = dataPayload;

  // Controllo campi obbligatori
  if (!nome || !descrizione || !data || !ora || !postiDisponibili || !luogo || !tipoEvento) {
    throw createError(400, 'Tutti i campi obbligatori devono essere valorizzati');
  }

  const newEvent = new Evento({
    nome,
    descrizione,
    data,
    ora,
    postiDisponibili,
    luogo,
    tipoEvento,
    tipoVisibilita: tipoVisibilita || 'pubblico',
  });

  try {
    const saved = await newEvent.save();
    return saved;
  } catch (err) {
    throw createError(500, 'Errore durante creazione evento');
  }
}

// restituzione lista eventi
async function listEvents(userId) {
  let query;
  if (userId) {
    query = {};
  } else {
    query = { tipoVisibilita: 'pubblico' };
  }
  try {
    const events = await Evento.find(query, 'nome data luogo tipoVisibilita');
    return events;
  } catch (err) {
    throw createError(500, 'Errore nel recupero degli eventi');
  }
}

// restituzione evento dato l'id
async function getEventById(id) {
  if (!id) {
    throw createError(400, 'Id evento mancante');
  }
  const event = await Evento.findById(id);
  if (!event) {
    throw createError(404, 'Evento non trovato');
  }
  return event;
}

// iscrizione evento
async function iscrivitiEvent(eventId, userId) {
  if (!eventId) {
    throw createError(400, 'ID evento mancante');
  }
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }

  //cerca evento
  const event = await Evento.findById(eventId);
  if (!event) {
    throw createError(404, 'Evento non trovato');
  }

  // controllo se l'utente è già iscritto
  const already = event.iscritti.find(uid => uid.toString() === userId);
  if (already) {
    throw createError(409, 'Sei già iscritto a questo evento');
  }

  // controllo posti disponibili
  if (event.postiOccupati >= event.postiDisponibili) {
    throw createError(409, 'Evento pieno, nessun posto disponibile');
  }

  // aggiunta dell'utente all'array iscritti e incremento postiOccupati
  event.iscritti.push(userId);
  event.postiOccupati = event.postiOccupati + 1;

  try {
    const saved = await event.save();
    return saved;
  } catch (err) {
    console.error('[iscrivitiEvent] Errore salvataggio:', err);
    throw createError(500, 'Errore interno durante l’iscrizione');
  }
}

module.exports = {
  createEvent,
  listEvents,
  getEventById,
  iscrivitiEvent
};

