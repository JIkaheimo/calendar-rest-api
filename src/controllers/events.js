const eventsRouter = require('express').Router()
const Event = require('../models/event')

// GET events
eventsRouter.get('/', (req, res) => {
  Event.find({}).then(events => {
    res.json(events.map(event => event.toJSON()))
  })
})

// GET event
eventsRouter.get('/:id', (req, res, next) => {
  Event.findById(req.params.id)
    .then(event => {
      if (event) res.json(event.toJSON())
      else res.status(404).send()
    })
    .catch(error => next(error))
})

// POST/CREATE event
eventsRouter.post('/', (req, res, next) => {
  const body = req.body

  const event = new Event({
    name: body.name,
    date: body.date,
    durationInHours: body.durationInHours
  })

  event
    .save()
    .then(savedEvent => {
      res.json(savedEvent.toJSON())
    })
    .catch(error => next(error))
})

// DELETE event
eventsRouter.delete('/:id', (req, res, next) => {
  Event.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

// PUT/UPDATE event
eventsRouter.put('/:id', (req, res, next) => {
  const body = req.body

  const event = {
    name: body.name,
    date: body.date,
    durationInHours: body.durationInHours
  }

  Event.findByIdAndUpdate(req.params.id, event, { new: true })
    .then(updatedEvent => {
      res.json(updatedEvent.toJSON())
    })
    .catch(error => next(error))
})

module.exports = eventsRouter
