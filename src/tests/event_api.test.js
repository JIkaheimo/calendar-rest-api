const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Event = require('../models/event');
const api = supertest(app);

const initialEvents = [
  {
    name: 'Programming exercise',
    date: '25.04.2019 15:30',
    durationInHours: 5
  },
  {
    name: 'Job interview',
    date: '28.04.2019 17:30',
    durationInHours: 5
  }
];

beforeEach(async () => {
  await Event.deleteMany({});

  let eventObj = new Event(initialEvents[0]);
  await eventObj.save();

  eventObj = new Event(initialEvents[1]);
  await eventObj.save();
});

test('events are returned as json', async () => {
  await api
    .get('/api/events')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('there are two events', async () => {
  const res = await api.get('/api/events');
  expect(res.body.length).toBe(2);
});

test('the first event is doing the programming exercise', async () => {
  const res = await api.get('/api/events');
  expect(res.body[0].name).toBe('Programming exercise');
});

afterAll(() => {
  mongoose.connection.close();
});
