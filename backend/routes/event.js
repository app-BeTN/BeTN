// backend/routes/event.js
const express = require('express');
const {
  createEventController,
  listEventsController,
  getEventController,
  iscrivitiController
} = require('../controllers/eventController');

const { authRequired } = require('../middleware/auth');

const router = express.Router();

// ▷ ▷ ▷ Nuova Route per iscriversi a un evento
// POST /api/event/:id/iscriviti
router.post('/api/event/:id/iscriviti', authRequired, iscrivitiController);

// ▷ ▷ ▷ Route esistenti
// POST /api/events        → createEventController
// GET  /api/events        → listEventsController
// GET  /api/events/:id    → getEventController
router.post('/api/events', createEventController);
router.get('/api/events', listEventsController);
router.get('/api/events/:id', getEventController);

// Alias (se li stai usando nel frontend)
// ex. GET /event/:id → getEventController
router.get('/event/:id', getEventController);

module.exports = router;