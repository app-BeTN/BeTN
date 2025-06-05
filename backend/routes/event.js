const express = require('express');
const {
  createEventController,
  listEventsController,
  getEventController,
  iscrivitiController
} = require('../controllers/eventController');

const { authRequired } = require('../middleware/auth');

const router = express.Router();

// POST /api/event/:id/iscriviti
router.post('/api/event/:id/iscriviti', authRequired, iscrivitiController);

// POST /api/events 
router.post('/api/events', createEventController);

// GET  /api/events
router.get('/api/events', listEventsController);

// GET  /api/events/:id
router.get('/api/events/:id', getEventController);

// GET /event/:id
router.get('/event/:id', getEventController);

module.exports = router;