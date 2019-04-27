const eventsRouter = require('express').Router();
const Event = require('../models/event');
const moment = require('moment');

// GET events
eventsRouter.get('/', async (req, res, next) => {
  const yearQuery = Number(req.query.year);
  const monthQuery = Number(req.query.month);
  const dayQuery = Number(req.query.day);
  const timeQuery = req.query.time;

  const eventAggr = Event.aggregate();

  // Filter by year
  if (yearQuery) {
    eventAggr.addFields({
      year: { $year: '$date' }
    });
    eventAggr.match({ year: yearQuery });
  }

  // Filter by months
  if (monthQuery) {
    eventAggr.addFields({
      month: { $month: '$date' }
    });
    eventAggr.match({ month: monthQuery });
  }

  // Filter by day
  if (dayQuery) {
    eventAggr.addFields({
      day: { $dayOfMonth: '$date' }
    });
    eventAggr.match({ day: dayQuery });
  }

  // Filter by time
  if (timeQuery) {
    let time = moment(timeQuery, 'HH:mm', true);
    if (!time) {
      return res
        .status(404)
        .json({ error: "time query parameter should be in format 'HH:mm'" })
        .end;
    }

    let offset = time.utcOffset() / 60 - 1;
    offset = `${offset >= 0 ? '+' : '-'}${
      offset > 9 ? offset : '0' + offset
    }:00`;

    // Add hour and minute fields to aggregation
    eventAggr

      .addFields({
        startingHour: { $hour: { date: '$date', timezone: offset.toString() } },
        startingMinute: { $minute: '$date' }
      })

      .addFields({
        endingHour: { $add: ['$startingHour', '$durationInHours'] }
      })

      .match({
        $and: [
          {
            startingHour: { $lte: time.hour() },
            startingMinute: { $lte: time.minute() }
          },
          {
            endingHour: { $gte: time.hour() }
          }
        ]
      });

    // Filter by minutes
  }

  // Limit retrieved data to 20
  eventAggr.limit(20);

  // Execute the aggregation query.
  const eventData = await eventAggr.exec();

  const events = eventData.map(event => new Event(event).toJSON());

  res.status(200).send(events);
});

// GET event
eventsRouter.get('/:id', async (req, res, next) => {
  try {
    let event = await Event.findById(req.params.id);

    if (event) {
      event = event.toJSON();
      res
        .json(event)
        .status(200)
        .end();
    } else {
      res.status(404).end();
    }
  } catch (exception) {
    next(exception);
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
