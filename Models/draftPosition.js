const mongoose = require('mongoose')

const positionSchema = new mongoose.Schema({
  pair: String,
  positionSize: Number,
  entry: Number,
  stop: Number,
  timeframe: String,
  date: String,
  entryPlaced: Boolean,
  stopPlaced: Boolean,
  tf1: String,
  tf2: String,
  tf3: String,
})

module.exports = mongoose.model('DraftPosition', positionSchema)
