const createError = require('http-errors');
const Evento = require('../models/Eventi');

/**
 * createEvent:
 *   - dataPayload: { nome, descrizione, data, ora, postiDisponibili, luogo, tipoEvento, tipoVisibilita }
 *   - userId: id dell’utente estratto dal token (anche se per ora non salviamo il creator)
 *   - Se manca un campo obbligatorio → 400
 *   - Restituisce l’evento creato
 */
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
    // NOTA: nel modello c’è anche “sponsorizzato”, “postiOccupati”, “iscritti”: rimangono ai default
  });

  try {
    const saved = await newEvent.save();
    return saved;
  } catch (err) {
    throw createError(500, 'Errore durante creazione evento');
  }
}

/**
 * listEvents:
 *   - Se userId presente → restituisci tutti gli eventi
 *   - Altrimenti → restituisci solo quelli con tipoVisibilita="pubblico"
 *   - Restituisce un array di eventi (solo alcuni campi: nome, data, luogo, tipoVisibilita)
 */
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

/**
 * getEventById:
 *   - id: string
 *   - Se id mancante → 400
 *   - Se non esiste → 404
 *   - Restituisce l’oggetto evento completo
 */
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

async function iscrivitiEvent(eventId, userId) {
  if (!eventId) {
    throw createError(400, 'ID evento mancante');
  }
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }

  // 1) Trovo l'evento
  const event = await Evento.findById(eventId);
  if (!event) {
    throw createError(404, 'Evento non trovato');
  }

  // 2) Controllo se l'utente è già iscritto
  const already = event.iscritti.find(uid => uid.toString() === userId);
  if (already) {
    throw createError(409, 'Sei già iscritto a questo evento');
  }

  // 3) Controllo posti disponibili
  if (event.postiOccupati >= event.postiDisponibili) {
    throw createError(409, 'Evento pieno, nessun posto disponibile');
  }

  // 4) Aggiungo l'utente all'array iscritti e incremento postiOccupati
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

