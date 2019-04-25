const config = require('./utils/config');
const express = require('express');
const app = express();
const eventsRouter = require('./controllers/events');
const middleware = require('./utils/middleware');
const mongoose = require('mongoose');

console.log('Connecting to', config.MONGODB_URI);

// Establish connection to remote database.
mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Succesfully connected to MongoDB!');
  })
  .catch(error => {
    console.log(
      'Error occured while trying to connect to MongoDB.',
      error.message
    );
  });

app.use(express.static('build'));
app.use(express.json());
app.use(middleware.connectionLogger);

app.use('/api/events', eventsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
