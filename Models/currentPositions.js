const mongoose = require('mongoose')

var positionSchema = new mongoose.Schema({
  pair: String,
  entry: Number,
  stop: Number,
  positionSize: Number,
  positionEntered: Boolean,
})

module.exports = mongoose.model('CurrentPos', positionSchema)
