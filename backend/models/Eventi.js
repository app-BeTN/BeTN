const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nome: { type: String, required: true },
  descrizione: { type: String },
  dataOra: { type: Date, required: true },
  postiDisponibili: { type: Number, required: true },
  creatore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
  luogo: { type: String, required: true },
  coordinate: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  tipoEvento: { type: String, required: true },
  partecipanti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utente' }],
  richieste: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utente' }],
  sponsorizzato: { type: Boolean }
});

module.exports = mongoose.model('Evento', eventoSchema);
