const mongoose = require('mongoose')

const positionSchema = new mongoose.Schema({
  pair: String,
  entry: Number,
  stop: Number,
  timeframe: String,
})

module.exprots = mongoose.model('Position', positionSchema)
