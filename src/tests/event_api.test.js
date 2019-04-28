const mongoose = require('mongoose');
const supertest = require('supertest');
const helpers = require('./helpers');
const axios = require('axios');
const app = require('../app');
const api = supertest(app);

const Event = require('../models/event');

describe('when there are initial notes in DB', async () => {
  beforeEach(async () => {
    // Clear test DB
    await Event.deleteMany({});
    // Add some data to test
    const eventObjs = helpers.initialEvents.map(event => new Event(event));
    const promises = eventObjs.map(event => event.save());
    await Promise.all(promises);
  });

  describe('GET /api/events', async () => {
    test('events are returned as JSON', async () => {
      await api
        .get('/api/events')
        .expect(200)
        .expect('Content-Type', /application\/json/);
    });

    test('all events are returned as json', async () => {
      const response = await api.get('/api/events');
      expect(response.body.length).toBe(helpers.initialEvents.length);
    });

    test('a specific event is within the returned events', async () => {
      const response = await api.get('/api/events');
      const events = response.body;
      const eventNames = events.map(event => event.name);
      const randomEvent = helpers.getRandomEvent(events);
      expect(eventNames).toContain(randomEvent.name);
    });
  });
});

describe('when there is no data in database', async () => {
  beforeEach(async () => {
    // Clear test DB
    await Event.deleteMany({});
  });

  describe('GET /api/events', async () => {
    test('no events are returned', async () => {
      await api.get('/api/events').expect(404);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
