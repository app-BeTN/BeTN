const createError = require('http-errors');
const Evento = require('../models/Eventi');
const Utente = require('../models/Utenti');

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
    creatore: userId
  });

  try {
    const saved = await newEvent.save();
    return saved;
  } catch (err) {
    throw createError(500, "Errore interno durante la creazione dell'evento");
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

// restituzione miei eventi
async function listMyEvents(userId) {
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }
  try {
    const events = await Evento.find({ creatore: userId }).sort({ data: 1 });
    return events;
  } catch (err) {
    throw createError(500, 'Errore interno nel recupero "miei eventi"');
  }
}

// restituzione eventi a cui sono iscritto
async function listEventIscritto(userId) {
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }
  try {
    const utente = await Utente.findById(userId);
    const events = await Evento.find({
      _id: { $in: utente.eventiIscritti }
    });
    return events;
  } catch (err) {
    throw createError(500, 'Errore interno nel recupero "eventi a cui sono iscritto"');
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

// modifica evento
async function updateEvent(id, dataPayload, userId) {
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }
  if (!id) {
    throw createError(400, 'ID evento mancante');
  }
  try {
    const event = await Evento.findById(id);
    if (!event) throw createError(404, 'Evento non trovato');

    // controllo ownership
    if (event.creatore.toString() !== userId) {
      throw createError(403, 'Non autorizzato a modificare questo evento');
    }

    // sovrascrivo i campi
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

    if (nome !== undefined) event.nome = nome;
    if (descrizione !== undefined) event.descrizione = descrizione;
    if (data !== undefined) event.data = data;
    if (ora !== undefined) event.ora = ora;
    if (postiDisponibili !== undefined) event.postiDisponibili = postiDisponibili;
    if (luogo !== undefined) event.luogo = luogo;
    if (tipoEvento !== undefined) event.tipoEvento = tipoEvento;
    if (tipoVisibilita !== undefined) event.tipoVisibilita = tipoVisibilita;

    const updated = await event.save();
    return updated;
  } catch (err) {
    console.error('[updateEvent] Errore nel service:', err);
    if (err.status) throw err;
    throw createError(500, 'Errore interno durante l’aggiornamento');
  }
}

// cancellazione evento
async function deleteEvent(id, userId) {
  if (!userId) {
    throw createError(401, 'Utente non autenticato');
  }
  if (!id) {
    throw createError(400, 'ID evento mancante');
  }
  try {
    const event = await Evento.findById(id);
    if (!event) throw createError(404, 'Evento non trovato');

    // controllo ownership
    if (event.creatore.toString() !== userId) {
      throw createError(403, 'Non autorizzato a eliminare questo evento');
    }

    await Evento.findByIdAndDelete(id);
    return;
  } catch (err) {
    console.error('[deleteEvent] Errore nel service:', err);
    if (err.status) throw err;
    throw createError(500, 'Errore interno durante la cancellazione');
  }
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

  const utente = await Utente.findById(userId);
  utente.eventiIscritti.push(eventId);

  try {
    const saved = await event.save();
    await utente.save();
    return saved;
  } catch (err) {
    console.error('[iscrivitiEvent] Errore salvataggio:', err);
    throw createError(500, 'Errore interno durante l’iscrizione');
  }
}

module.exports = {
  createEvent,
  listEvents,
  listMyEvents,
  listEventIscritto,
  getEventById,
  updateEvent,
  deleteEvent,
  iscrivitiEvent
};

