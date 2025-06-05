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
  // controllo base sui campi
  if (!nome || !email || !password || !tipo) {
    throw createError(400, 'Nome, email, password e tipo sono obbligatori');
  }
  // controllo esistenza utente
  const existing = await Utente.findOne({ $or: [{ email }, { nome }] });
  if (existing) {
    throw createError(409, 'Utente già esistente');
  }
  // hash della password
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  // creazione utente e salvataggio
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

module.exports = {
  signup,
  loginUser
};
