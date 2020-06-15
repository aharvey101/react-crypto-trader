const Position = require('../Models/position')

const databaseManager = {}

databaseManager.createPosition = async (order, position) => {
  //create position
  const newPosition = {
    pair: order.pair,
    positionSize: order.positionSize,
    entry: order.entry,
    stop: order.stop,
    timeframe: order.timeframe,
    averageFillPrice: position[0].recentAverageOpenPrice,
  }
  const response = await Position.create(newPosition, function (
    err,
    newlyCreated
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `the newly created position is: ${JSON.stringify(newlyCreated)}`
      )
    }
  })
  return response
}

databaseManager.updatePosition = async (
  existingPositionInfo,
  stopOrderInfo
) => {
  // process new position info
  const { averageFillPrice } = stopOrderInfo
  const newDBPosition = { ...existingPositionInfo, averageFillPrice }
  // use incoming positionInfo to call position
  Position.findByIdAndUpdate(existingPositionInfo.id, newDBPosition, function (
    err,
    newPostionEntry
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log(newPositionEntry)
    }
  })
}

module.exports = databaseManager
