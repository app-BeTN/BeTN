const express = require('express');
const { loginController } = require('../controllers/authController');
const router = express.Router();

// POST /api/login
//   - Chiama loginController che restituirà { token, user }
router.post('/api/login', loginController);

module.exports = router;
