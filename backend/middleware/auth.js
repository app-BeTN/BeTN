const jwt = require('jsonwebtoken');
const createError = require('http-errors');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * authRequired:
 *   - Verifica la presenza di “Authorization: Bearer <token>”
 *   - Se valido, assegna `req.user = { id, tipo }`
 *   - Se manca o non valido, risponde 401
 */
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
 * authOptional:
 *   - Se header `Authorization` presente e valido, popula `req.user`
 *   - Altrimenti va avanti senza bloccare.
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
    // token non valido → non blocchiamo, ma non mettiamo req.user
  }
  return next();
}

module.exports = {
  authRequired,
  authOptional
};
