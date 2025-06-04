const createError = require('http-errors');
const authService = require('../services/authService');

async function registerController(req, res, next) {
  try {
    const nuovo = await authService.registerUser(req.body);
    return res.status(201).json(nuovo);
  } catch (err) {
    if (createError.isHttpError(err)) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    return next(err);
  }
}

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

module.exports = {
  registerController,
  loginController
};
