const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)

const eventSchema = new mongoose.Schema({
  name: { type: String, minlength: 6, required: true },
  date: { type: Date, required: true },
  durationInHours: { type: Number, min: 1, max: 100, required: true }
})

eventSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Event', eventSchema)