const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

// controllo del token per la verifica che l'utente abbia effettuato l'accesso
async function authRequired(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw createError(401, 'Token mancante');
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      throw createError(401, 'Token mancante');
    }
    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload.id) {
      throw createError(401, 'Token non valido');
    }
    // mettiamo nel request l’id e il tipo di utente
    req.user = { id: payload.id, tipo: payload.tipo };
    return next();
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

/**
 *  se header `Authorization` è presente e valido, popula `req.user`
 *  altrimenti va avanti senza bloccare
 */
async function authOptional(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.id) {
      req.user = { id: payload.id, tipo: payload.tipo };
    }
  } catch {

  }
  return next();
}

module.exports = {
  authRequired,
  authOptional
};
