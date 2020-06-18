const Position = require('../Models/position')
const CurrentPos = require('../Models/currentPositions')

const databaseManager = {}

databaseManager.currentPositions = async (order) => {
  const newCurrentPostion = order
  const dbResponse = await CurrentPos.create(newCurrentPostion, function (
    err,
    positions
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log('submitted current positions to db for watching', positions)
    }
  })
  return dbResponse
}

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
    function (err, newPositionEntry) {
      if (err) {
        console.log(err)
      } else {
        console.log(newPositionEntry)
      }
    }
  )
  return dbPos
}

// When a position has been exited, it needs to ne removed from the current posisitons collection
databaseManager.deleteCurrentPos = async (order) => {
  const dbCurrentPositions = await CurrentPos.find({})
  const filtered = dbCurrentPositions.filter((pos) => pos.pair === order.pair)
  filtered.forEach((position) => {
    CurrentPos.findByIdAndDelete(position.id, function (err, res) {
      console.log(res)
    })
  })
}

databaseManager.lookup = () => {
  // Lookup all positions and return
  const positions = CurrentPos.find({}, function (err, positions) {
    if (err) {
      console.log(err)
    } else {
      console.log(positions)
    }
  })
  return positions
}

module.exports = databaseManager
