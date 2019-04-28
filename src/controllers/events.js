const eventsRouter = require('express').Router();
const Event = require('../models/event');
const queries = require('../queries/event_queries');
const moment = require('moment');

// GET events
eventsRouter.get('/', async (req, res, next) => {
  // Get "known" query parameters
  const yearQuery = Number(req.query.year);
  const monthQuery = Number(req.query.month);
  const dayQuery = Number(req.query.day);
  const time = moment(req.query.time, 'HH:mm', true);
  const sorted = Boolean(req.query.sorted);

  // Initialize the aggregator
  const eventAggr = Event.aggregate();
  eventAggr.addFields({ _: null });

  // Apply filters
  if (yearQuery) queries.applyYearFilter(eventAggr, yearQuery);
  if (monthQuery) queries.applyMonthFilter(eventAggr, monthQuery);
  if (dayQuery) queries.applyDayFilter(eventAggr, dayQuery);

  if (time.isValid()) {
    const utcTime = time.utc();
    queries.applyTimeFilter(eventAggr, utcTime.hour(), utcTime.minute());
  }

  // Sorting
  if (sorted) eventAggr.sort('date');

  // Request data with the aggreagator.
  try {
    const eventData = await eventAggr.exec();

    if (eventData.length) {
      const events = eventData.map(event => new Event(event).toJSON());
      res.status(200).send(events);
    } else
      res.status(204).send({ error: 'No documents in this collection...' });
  } catch (error) {
    next(error);
  }
});

// GET event
eventsRouter.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    // Success
    if (event) {
      const eventJSON = event.toJSON();
      res
        .json(eventJSON)
        .status(200)
        .end();
      // Not in DB
    } else {
      res.status(404).end();
    }
    // Other errors
  } catch (e) {
    next(e);
  }
});

// POST/CREATE event
eventsRouter.post('/', async (req, res, next) => {
  const body = req.body;
  let date = body.date;

  const event = new Event({
    ...body,
    date
  });

  try {
    const savedEvent = await event.save();
    res.status(201).json(savedEvent.toJSON());
  } catch (e) {
    next(e);
  }
});

// DELETE event
eventsRouter.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findByIdAndRemove(req.params.id);
    if (!event) res.status(204).end();
    else res.status(200).end();
  } catch (e) {
    next(e);
  }
});

// PUT/UPDATE event
eventsRouter.put('/:id', (req, res, next) => {
  const body = req.body;
  let date = body.date;

  const event = {
    ...body
  };

  if (date !== null) event.date = date;

  Event.findByIdAndUpdate(req.params.id, event, {
    new: true,
    upsert: true,
    runValidators: true
  })
    .then(updatedEvent => {
      res.json(updatedEvent.toJSON());
    })
    .catch(error => next(error));
});

module.exports = eventsRouter;
