const createError = require('http-errors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Utente = require('../models/Utenti');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h'; // fallback

// signup utente
async function signup(data) {
  const { nome, email, password, tipo, azienda } = data;
  if (!nome || !email || !password || !tipo) {
    throw createError(400, 'Nome, email, password e tipo sono obbligatori');
  }

  // controllo se esiste già utente con stessa email
  const byEmail = await Utente.findOne({ email });
  if (byEmail) {
    throw createError(409, 'Email già in uso');
  }

  // controllo se esiste già utente con stesso nome
  const byNome = await Utente.findOne({ nome });
  if (byNome) {
    throw createError(409, 'Nome utente già in uso');
  }

  // se tutto corretto si crea l'utente
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  const user = new Utente({ nome, email, password: hashed, tipo, azienda });
  const saved = await user.save();
  return {
    id: saved._id,
    nome: saved.nome,
    email: saved.email,
    tipo: saved.tipo,
    azienda: saved.azienda
  };
}

// login utente
async function loginUser(data) {
  const { email, password } = data;
  if (!email || !password) {
    throw createError(400, 'Email e password sono obbligatori');
  }
  const user = await Utente.findOne({ email });
  if (!user) {
    throw createError(401, 'Utente non trovato');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Password errata');
  }
  const payload = { id: user._id, tipo: user.tipo };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  return {
    token,
    user: {
      id: user._id,
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      azienda: user.azienda
    }
  };
}
// ──────────────────────────────────────────
// updateUser: modifica i campi consentiti, hash sulla password se presente
async function updateUser(userId, data) {
  const update = {};
  if (data.nome)     update.nome     = data.nome;
  if (data.email)    update.email    = data.email;
  if (data.tipo)     update.tipo     = data.tipo;
  if (data.azienda)  update.azienda  = data.azienda;
  if (data.password) {
    const salt     = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(data.password, salt);
  }

  const user = await Utente.findByIdAndUpdate(userId, update, {
    new: true,                 // ritorna il documento aggiornato
    runValidators: true        // rispetta gli enum / required
  }).select('-password');
  if (!user) throw createError(404, 'Utente non trovato');
  return user;
}

module.exports = {
  signup,
  loginUser,
  updateUser,    // ← esportalo
};

