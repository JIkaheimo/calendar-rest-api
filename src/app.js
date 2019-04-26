const config = require('./utils/config');
const express = require('express');
const app = express();
const eventsRouter = require('./controllers/events');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

logger.info('Connecting to', config.mongoUrl);

// Establish connection to remote database.
mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    logger.info('Succesfully connected to MongoDB!');
  })
  .catch(error => {
    logger.error(
      'Error occured while trying to connect to MongoDB.',
      error.message
    );
  });

// Middlewares
app.use(express.static('build'));
app.use(express.json());
app.use(middleware.connectionLogger);

app.use('/api/events', eventsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
