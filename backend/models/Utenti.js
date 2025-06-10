const mongoose = require('mongoose');

const utenteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  tipo: { type: String, enum: ["privato", "azienda", "comune", "admin"], required: true },
  azienda: { type: String, default: null },
  eventiIscritti: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Evento' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Utente', utenteSchema, 'utenti');
