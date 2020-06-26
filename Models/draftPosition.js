const mongoose = require('mongoose')

const positionSchema = new mongoose.Schema({
  pair: String,
  entry: Number,
  stop: Number,
  positionSize: Number,
  positionEntered: Boolean,
  stopPlaced: Boolean,
})

module.exports = mongoose.model('DraftPosition', positionSchema)
