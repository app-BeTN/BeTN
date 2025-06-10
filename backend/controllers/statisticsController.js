const {
  fetchEventStats,
  fetchTopEvents,
  fetchFillRates,
  fetchEventsOverTime
} = require('../services/statisticsService');

exports.getStats = async (req, res, next) => {
  try {
    res.json(await fetchEventStats());
  } catch (err) { next(err); }
};

exports.topEvents = async (req, res, next) => {
  try {
    res.json(await fetchTopEvents(5));
  } catch (err) { next(err); }
};

exports.fillRates = async (req, res, next) => {
  try {
    res.json(await fetchFillRates());
  } catch (err) { next(err); }
};

exports.eventsOverTime = async (req, res, next) => {
  try {
    res.json(await fetchEventsOverTime());
  } catch (err) { next(err); }
};