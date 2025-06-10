// backend/services/statisticsService.js

const Evento = require('../models/Eventi');

/**
 * Ritorna il trend dei nuovi eventi negli ultimi 30 giorni
 * basandosi su Evento.createdAt (timestamp automatico)
 */
async function fetchEventsOverTime() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const agg = await Evento.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id': 1 } }
  ]);

  return agg.map(r => ({ date: r._id, count: r.count }));
}

/**
 * Ritorna il totale eventi e iscrizioni per evento
 */
async function fetchEventStats() {
  const events = await Evento.find({}, 'nome iscritti').lean();
  const totalEvents = events.length;

  let totalRegistrations = 0;
  const registrationsPerEvent = {};
  events.forEach(e => {
    const cnt = Array.isArray(e.iscritti) ? e.iscritti.length : 0;
    totalRegistrations += cnt;
    registrationsPerEvent[e._id] = cnt;
  });

  return { totalEvents, totalRegistrations, registrationsPerEvent };
}

/**
 * Ritorna i top N eventi per numero di iscritti
 */
async function fetchTopEvents(limit = 5) {
  const events = await Evento.find({}, 'nome iscritti').lean();
  return events
    .map(e => ({
      id: e._id,
      name: e.nome,
      count: Array.isArray(e.iscritti) ? e.iscritti.length : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Ritorna il tasso di riempimento per ciascun evento
 * usa `postDisponibili` invece di un valore fisso
 */
async function fetchFillRates() {
  const events = await Evento.find({}, 'nome iscritti postiDisponibili').lean();

  return events.map(e => {
    const registered = Array.isArray(e.iscritti) ? e.iscritti.length : 0;
    const capacity   = typeof e.postiDisponibili === 'number' ? e.postiDisponibili : 1;
    const fillRate   = Math.round((registered / capacity) * 100);

    return {
      id: e._id,
      name: e.nome,
      capacity,
      registered,
      fillRate
    };
  });
}

module.exports = {
  fetchEventStats,
  fetchTopEvents,
  fetchFillRates,
  fetchEventsOverTime
};
