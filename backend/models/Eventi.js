const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descrizione: { type: String },
  data: { type: Date, required: true },
  ora: { type: String, required: true },
  postiDisponibili: { type: Number, required: true },
  //creatore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
  luogo: { type: String, required: true },
  /*coordinate: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },*/
  tipoEvento: { type: String, required: true },
  //richieste: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utente' }],
  sponsorizzato: { type: Boolean },
  postiOccupati: { type: Number, default: 0 }
});

module.exports = mongoose.model('Evento', eventoSchema, 'eventi');
