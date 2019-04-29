const mongoose = require('mongoose');
const moment = require('moment');

const validateDateString = date => {
  // Make sure the given date is in correct format and wrap it.
  date = moment(date, 'DD.MM.YYYY HH:mm', true);
  return date;
};

const stringifyDate = date => {
  // Format date after retrieving it in ISO-format
  date = moment(date);
  date = date.format('DD.MM.YYYY HH:mm');
  return date;
};

const eventSchema = new mongoose.Schema({
  name: { type: String, minlength: 6, required: true },
  date: {
    type: Date,
    required: true,
    set: validateDateString,
    get: stringifyDate
  },
  durationInHours: { type: Number, min: 1, max: 100, required: true }
});

eventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.date = stringifyDate(returnedObject.date);

    // Remove unnecessary database fields.
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

module.exports = mongoose.model('Event', eventSchema);
