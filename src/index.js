const express = require('express');
const cors = require('cors');
const app = express();

const requestLogger = (req, res, next) => {
  console.log('Method:', req.method);
  console.log('Path:  ', req.path);
  console.log('Body:  ', req.body);
  console.log('---');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' });
};

const generateId = () => {
  const maxId =
    events.length > 0 ? Math.max(...events.map(cEvent => cEvent.id)) : 0;
  return maxId + 1;
};

app.use(cors());
app.use(express.static('buid'));
app.use(express.json());
app.use(requestLogger);

let events = [
  {
    id: 1,
    name: 'Event 1',
    date: '2017-12-10T17:30:31.098Z',
    durationInHours: 3
  },
  {
    id: 2,
    name: 'Event 2',
    date: '2017-12-10T17:30:31.098Z',
    durationInHours: 2
  },
  {
    id: 3,
    name: 'Event 3',
    date: '2017-12-10T17:30:31.098Z',
    durationInHours: 1
  },
  {
    id: 4,
    name: 'Event 4',
    date: '2017-12-10T17:30:31.098Z',
    durationInHours: 5
  },
  {
    id: 5,
    name: 'Event 5',
    date: '2017-12-10T17:30:31.098Z',
    durationInHours: 4
  }
];

const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Test!');
});

app.get('/events', (req, res) => {
  res.json(events);
});

app.get('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  const event = events.find(cEvent => cEvent.id === id);

  if (event) res.json(event);
  else res.status(404).end();
});

app.post('/events', (req, res) => {
  const body = req.body;

  if (!body.name) {
    return res.status(404).json({
      error: 'Event name missing.'
    });
  }
  if (!body.date) {
    return res.status(404).json({
      error: 'Event date missing.'
    });
  }
  if (!body.durationInHours) {
    return res.status(404).json({
      error: 'Event duration missing.'
    });
  }

  const event = {
    name: body.name,
    date: body.date,
    durationInHours: body.durationInHours,
    id: generateId()
  };

  events = events.concat(event);
  res.json(event);
});

app.delete('/events/:id', (req, res) => {
  const id = Number(req.params.id);
  events = events.filter(cEvent => cEvent.id !== id);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(unknownEndpoint);
