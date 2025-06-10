const createError = require('http-errors');
const authService = require('../services/authService');
const { emailExists } = require('../services/authService');
const { uTipo } = require('../services/authService');


//signup controller
async function signupController(req, res, next) {
  try {
    const nuovo = await authService.signup(req.body);
    return res.status(201).json(nuovo);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

// login controller
async function loginController(req, res, next) {
  try {
    const result = await authService.loginUser(req.body);
    return res.json(result);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

async function checkEmail(req, res, next) {
  try {
    const { email } = req.query;
    const exists = await emailExists(email);
    return res.json({ exists });
  } catch (err) {
    next(err);
  }
}


async function checkTipo(req, res, next) {
  try {
    console.log('aaaaa');
    const userId = req.user.id;
    const tipo = await uTipo(userId);
    return res.json({ tipo });
  } catch (err) {
    next(err);
  }
}


// update utente (PUT /api/me)
async function updateController(req, res, next) {
  try {
    const userId = req.user.id;              // viene messo da authRequired
    const aggiornato = await authService.updateUser(userId, req.body);
    return res.json(aggiornato);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

module.exports = {
  signupController,
  loginController,
  updateController, 
  checkTipo,
  checkEmail,   // ← esportalo
};


