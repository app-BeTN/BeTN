const mongoose = require('mongoose');

const eventoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  descrizione: { type: String },
  data: { type: Date, required: true },
  ora: { type: String, required: true },
  postiDisponibili: { type: Number, required: true },
  creatore: { type: mongoose.Schema.Types.ObjectId, ref: 'Utente', required: true },
  luogo: { type: String, required: true },
  /*coordinate: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },*/
  tipoEvento: { type: String, required: true },
  //richieste: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Utente' }],
  sponsorizzato: { type: Boolean },
  postiOccupati: { type: Number, default: 0 },
  tipoVisibilita: { type: String, enum: ["pubblico", "privato"], default: "pubblico" },
  iscritti: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Evento', eventoSchema, 'eventi');
