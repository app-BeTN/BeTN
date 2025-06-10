const express = require('express');
const {
  createEventController,
  listEventsController,
  listMyEventsController,
  getEventController,
  updateEventController,
  deleteEventController,
  iscrivitiController,
  listEventIscrittoController
} = require('../controllers/eventController');

const { authRequired } = require('../middleware/auth');

const router = express.Router();

// POST /api/event/:id/iscriviti
router.post('/api/event/:id/iscriviti', authRequired, iscrivitiController);

// POST /api/events 
router.post('/api/events', createEventController);

// GET  /api/events
router.get('/api/events', listEventsController);

// GET /api/events/my
router.get('/api/events/my', authRequired, listMyEventsController);

// GET /api/events/iscritto
router.get('/api/events/iscritto', authRequired, listEventIscrittoController);

// GET  /api/events/:id
router.get('/api/events/:id', getEventController);

// GET /event/:id
router.get('/event/:id', getEventController);

// PUT /api/events/:id
router.put('/api/events/:id', authRequired, updateEventController);

// DELETE  /api/events/:id
router.delete('/api/events/:id', authRequired, deleteEventController);

module.exports = router;