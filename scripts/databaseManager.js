const Position = require('../Models/position')

const databaseManager = {}

databaseManager.createPosition = async (order, position, entryOrder) => {
  //create position
  const newPosition = {
    pair: order.pair,
    positionSize: order.positionSize,
    entry: order.entry,
    stop: order.stop,
    timeframe: order.timeframe,
    date: new Date(),
    entryOrderId: entryOrder.result.id,
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
  console.log(newDBPosition)
  // use incoming positionInfo to call position
  const dbPos = await Position.findByIdAndUpdate(
    existingPositionInfo.id,
    newDBPosition,
    function (err, newPostionEntry) {
      if (err) {
        console.log(err)
      } else {
        console.log(newPositionEntry)
      }
    }
  )
  return dbPos
}

module.exports = databaseManager
