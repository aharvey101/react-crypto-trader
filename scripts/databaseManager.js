const Position = require('../Models/position')
const DraftPosition = require('../Models/draftPosition')

const databaseManager = {}

databaseManager.draftPositions = async (draftPosition) => {
  const newCurrentPostion = draftPosition
  DraftPosition.create(newCurrentPostion, function (
    err,
    position
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log('submitted draft position to db for watching', position)
      return position
    }
  })

  const findInDB = async () => {
    const dbResponse = await DraftPosition.find({}, (err, res) => {
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
databaseManager.updateDraftPosition = async function (draftPosition, entryPlaced) {
  // process entry Order information
  const newCurrentPos = { ...draftPosition, entryPlaced: entryPlaced }
  const response = await DraftPosition.findOneAndUpdate(draftPosition.pair, newCurrentPos, function (err, newCurrentPos) {
    if (err) {
      console.log(err);
    }
    else console.log(`updated draft position with entryPlaced:`, newCurrentPos);
  })
  return response
}

databaseManager.updateDraftPositionStop = async function (currentPosition, stopEntered) {
  // process entry Order information
  const newCurrentPos = { ...currentPosition, stopPlaced: stopEntered }
  const response = await DraftPosition.findOneAndUpdate(currentPosition.pair, newCurrentPos, function (err, newCurrentPos) {
    if (err) {
      console.log(err);
    }
    console.log('updated draft position:', newCurrentPos);
  })
  return response
}
databaseManager.createPosition = async (draftPosition, exchangePostionInfo, entryOrder, stopOrder) => {
  //create position
  const newPosition = {
    pair: draftPosition.pair,
    positionSize: draftPosition.positionSize,
    entry: draftPosition.entry,
    stop: draftPosition.stop,
    timeframe: draftPosition.timeframe,
    tf1: draftPosition.tf1,
    tf2: draftPosition.tf2,
    tf3: draftPosition.tf3,
    date: new Date(),
    entryOrder: entryOrder,
    position: exchangePostionInfo,
    stopOrder: stopOrder
  }

  Position.create(newPosition, function (
    err,
    newlyCreated
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `the newly created position is:`, newlyCreated
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
        console.log('found position in DB');
        return res
      }
    })
    return dbResponse
  }

  const found = await returnPromise()


  return found
}

databaseManager.updatePosition = async (
  existingPositionInfo,
  stopOrder
) => {
  // process new position info
  const test = { ...existingPositionInfo }
  console.log('test is,', test);
  const existing = existingPositionInfo
  const newDBPosition = { ...existing, stopOrder: stopOrder }
  console.log('newDBPosition is ', newDBPosition)
  // use incoming positionInfo to call position
  const dbPos = await Position.findOneAndUpdate(
    existingPositionInfo,
    newDBPosition,
    function (err, newPositionEntry) {
      if (err) {
        console.log(err)
      } else {
        console.log('new Database Position is', newPositionEntry)
      }
    }
  )
  return dbPos
},
  databaseManager.findByIdAndUpdate = async (pos) => {
    Position.findByIdAndUpdate(pos._id, pos, (err, newPosition) => {
      if (err) console.log(err);
      console.log('updated position is', newPosition);
      bot.sendMessage(chatId, `Got fill for ${filteredPosition[0].pair}, the updated position is ${newPosition}`)
    })
  }

// When a position has been exited, it needs to ne removed from the current posisitons collection
databaseManager.deleteDraftPosition = async (draftPosition) => {
  const dbCurrentPositions = await DraftPosition.find({})
  const filtered = dbCurrentPositions.filter((pos) => pos.pair === draftPosition.pair)
  filtered.forEach((position) => {
    DraftPosition.findByIdAndDelete(position.id, function (err, res) {
      if (err) console.log(err);
      console.log('deleted: ', res);
    })
  })
}

databaseManager.lookup = () => {
  // Lookup all positions and return
  const positions = DraftPosition.find({}, function (err) {
    if (err) {
      console.log(err)
    } else {
    }
  })
  return positions
}
databaseManager.getPositions = async () => {
  const response = await Position.find({}).catch(err => console.log(err))

  return response
}

module.exports = databaseManager
