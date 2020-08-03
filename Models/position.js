const mongoose = require('mongoose')

var positionSchema = new mongoose.Schema({
  pair: String,
  positionSize: Number,
  entry: Number,
  stop: Number,
  timeframe: String,
  date: String,
  tf1: String,
  tf2: String,
  tf3: String,
  entryOrder: Object,
  position: Object,
  stopOrder: Object,
  pnl: Number,

})

module.exports = mongoose.model('Position', positionSchema)
