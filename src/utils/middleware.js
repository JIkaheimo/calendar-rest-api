const logger = require('./logger');

const connectionLogger = (req, res, next) => {
  logger.info('------------------------');
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Body:  ', req.body);
  logger.info('-------------------------');
  next();
};

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint.' });
};

const errorHandler = (error, req, res, next) => {
  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return res.status(400).send({ error: 'Invalid ID format.' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  logger.error(error.message);
  next(error);
};

module.exports = {
  connectionLogger,
  unknownEndpoint,
  errorHandler
};
