module.exports = function validatePassword(req, res, next) {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: 'Password mancante' });
  }

  const lengthOK = password.length >= 6;
  const upperOK = /[A-Z]/.test(password);
  const digitOK = /[0-9]/.test(password);
  const symbolOK = /[!@#$%^&*]/.test(password);

  if (!lengthOK || !upperOK || !digitOK || !symbolOK) {
    return res.status(400).json({
      message: 'La password deve contenere almeno 6 caratteri, una lettera maiuscola, un numero e un simbolo (!@#$%^&*)'
    });
  }

  next();
};
