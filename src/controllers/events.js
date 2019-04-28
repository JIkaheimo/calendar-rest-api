const eventsRouter = require('express').Router();
const Event = require('../models/event');
const queries = require('../queries/event_queries');
const moment = require('moment');

// GET events
eventsRouter.get('/', async (req, res, next) => {
  // QUERY PARAMS
  const name = req.query.name;
  const year = Number(req.query.year);
  const month = Number(req.query.month);
  const day = Number(req.query.day);
  const time = moment(req.query.time, 'HH:mm', true);
  const sorted = Boolean(req.query.sorted);

  // INIT
  const eventAggr = Event.aggregate();
  eventAggr.addFields({ _: null });

  // FILTERS
  if (name) {
    queries.applyNameFilter(eventAggr, String(name));
  }
  if (year) queries.applyYearFilter(eventAggr, year);
  if (month) queries.applyMonthFilter(eventAggr, month);
  if (day) queries.applyDayFilter(eventAggr, day);
  if (time.isValid()) {
    const utcTime = time.utc();
    queries.applyTimeFilter(eventAggr, utcTime.hour(), utcTime.minute());
  }

  // SORTING
  if (sorted) eventAggr.sort('date');

  // FETCH DATA
  try {
    const eventData = await eventAggr.exec();
    if (eventData.length) {
      const events = eventData.map(event => new Event(event).toJSON());
      res.json(events);
    } else res.status(404).end();
  } catch (exception) {
    next(exception);
  }
});

// GET event
eventsRouter.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) res.json(event.toJSON());
    else res.status(404).end();
  } catch (exception) {
    next(exception);
  }
});

// POST/CREATE event
eventsRouter.post('/', async (req, res, next) => {
  const event = new Event(req.body);

  try {
    const savedEvent = await event.save();
    res.json(savedEvent.toJSON());
  } catch (exception) {
    next(exception);
  }
});

// DELETE event
eventsRouter.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id);
    if (!event) res.status(204).end();
    else res.status(200).end();
  } catch (exception) {
    next(exception);
  }
});

// PUT/UPDATE event
eventsRouter.put('/:id', async (req, res, next) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    if (updatedEvent) res.json(updatedEvent.toJSON());
    else res.status(404).end();
  } catch (exception) {
    next(exception);
  }
});

module.exports = eventsRouter;
