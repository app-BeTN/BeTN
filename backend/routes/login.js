const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const Utente = require('../models/Utenti');
require('dotenv').config();

const secretKey = process.env.JWT_SECRET;

//login utente
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await Utente.findOne({ email });

    if (!user) {
        return res.json({ success: false, message: 'Utente non trovato' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
        return res.json({ success: false, message: 'Password errata' });
    }

    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '2h' });

    res.json({ success: true, token });
});

module.exports = router;