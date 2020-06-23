const Position = require('../Models/position')
const CurrentPos = require('../Models/currentPositions')

const databaseManager = {}

databaseManager.currentPositions = async (order) => {
  console.log(`the order before submitting to current positions is `, order);
  const newCurrentPostion = order
  CurrentPos.create(newCurrentPostion, function (
    err,
    positions
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log('submitted current positions to db for watching', positions)
      return positions
    }
  })

  const findInDB = async () => {
    const dbResponse = await CurrentPos.find({}, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        return res
      }
    })
    return dbResponse
  }

  function find() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return resolve(findInDB())
      }, 500);
    })
  }


  return find()
}
//Updates current positions with entry order information
databaseManager.updateCurrentPos = async function (currentPosition, posEntered) {
  // process entry Order information
  const newCurrentPos = { ...currentPosition, positionEntered: posEntered }
  const response = await CurrentPos.findOneAndUpdate(currentPosition.pair, newCurrentPos, function (err, newCurrentPos) {
    if (err) {
      console.log(err);
    }
  })
  return response
}

databaseManager.createPosition = async (order, position, entryOrder) => {
  //create position
  const newPosition = {
    pair: order.pair,
    positionSize: order.positionSize,
    entry: order.entry,
    stop: order.stop,
    timeframe: order.timeframe,
    tf1: order.tf1,
    tf2: order.tf2,
    tf3: order.tf3,
    date: new Date(),
    entryOrderId: entryOrder.result.id,
    averageFillPrice: position[0].recentAverageOpenPrice,
  }

  Position.create(newPosition, function (
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

  function returnPromise() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(findInDB())
      }, 2500)
    })
  }
  // find all positions in db
  const findInDB = async () => {
    const dbResponse = await Position.findOne(newPosition, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        return res
      }
    })
    return dbResponse
  }

  const found = await returnPromise()
  // Currently doesn't work
  console.log('response before returning in createPosition is', found);

  // filter by date
  // return

  return found
}

databaseManager.updatePosition = async (
  existingPositionInfo,
  stopOrderInfo
) => {
  // process new position info
  const { avgFillPrice } = stopOrderInfo
  const newDBPosition = { ...existingPositionInfo, avgFillPrice }
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
  console.log('fitlered pairs is', filtered);
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
