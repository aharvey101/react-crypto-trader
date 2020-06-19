const mongoose = require('mongoose')

var positionSchema = new mongoose.Schema({
  pair: String,
  positionSize: Number,
  entry: Number,
  stop: Number,
  timeframe: String,
  date: String,
  entryOrderId: Number,
  exchangeOrderID: Number,
  averageFillPrice: Number,
  tf1: String,
  tf2: String,
  tf3: String,
})

module.exports = mongoose.model('Position', positionSchema)
