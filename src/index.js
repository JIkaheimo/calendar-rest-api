if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const cors = require('cors');
const app = express();
const Event = require('./models/event');

// MIDDLEWARES =================
const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

const errorHandler = (error, req, res, next) => {
  console.error(error.message);

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'Wrong ID format.' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(requestLogger);

// REQUSTS ================

app.get('/', (req, res) => {
  res.send('Test!');
});

// GET events
app.get('/api/events', (req, res) => {
  Event.find({}).then(events => {
    res.json(events.map(event => event.toJSON()));
  });
});

// GET event
app.get('/api/events/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      if (event) res.json(event.toJSON());
      else res.status(204).send();
    })
    .catch(error => next(error));
});

// PUT/UPDATE event
app.put('/api/events/:id', (req, res, next) => {
  const body = req.body;

  const event = {
    ...body
  };

  Event.findByIdAndUpdate(req.params.id, event, { new: true })
    .then(updatedEvent => {
      res.json(updatedEvent.toJSON());
    })
    .catch(error => next(error));
});

// POST/CREATE event
app.post('/api/events', (req, res, next) => {
  const body = req.body;

  const event = new Event({
    name: body.name,
    date: body.date,
    durationInHours: body.durationInHours
  });

  event
    .save()
    .then(savedEvent => savedEvent.toJSON())
    .then(savedAndFormattedEvent => {
      res.json(savedAndFormattedEvent);
    })
    .catch(error => next(error));
});

// DELETE event
app.delete('/api/events/:id', (req, res, next) => {
  Event.findByIdAndRemove(req.params.id)
    .then(event => {
      res.status(204).end();
    })
    .catch(error => next(error));
});

// SETUP CONNECTION ==============

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Display verbose error for invalid paths.
app.use(unknownEndpoint);
// Handle errors that are passed from requests handlers.
app.use(errorHandler);
