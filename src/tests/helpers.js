const Event = require('../models/event');
const initialEvents = require('./testdata.json');

const nonExistingId = async () => {
  const event = new Event({ name: 'Non-existing', date: '01-01-2001' });
  await event.save();
  await event.remove();
  return event._id.toString();
};

const eventsInDatabase = async () => {
  const events = Event.find({});
  return events.map(event => event.toJSON());
};

const getRandomEvent = events => {
  return events[Math.floor(Math.random() * events.length)];
};

module.exports = {
  initialEvents,
  nonExistingId,
  eventsInDatabase,
  getRandomEvent
};
