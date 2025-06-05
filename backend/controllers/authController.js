const createError = require('http-errors');
const authService = require('../services/authService');

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

module.exports = {
  signupController,
  loginController
};
