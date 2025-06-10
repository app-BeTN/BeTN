const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/statisticsController');

// montato in server.js: app.use('/api/statistics', statisticsRoutes)
router.get('/',         ctrl.getStats);
router.get('/over-time', ctrl.eventsOverTime);
router.get('/top-events',ctrl.topEvents);
router.get('/fill-rates',ctrl.fillRates);

module.exports = router;