const exchange = require('./exchange')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')
const concurrentPositons = {}

concurrentPositons.start = async () => {
  // looks up draftPositions, starts position
  const positions = await databaseManager.lookup()
  console.log(positions);
  positions.forEach((position) => {
    concurrentPositons.position(position)
  })
}

concurrentPositons.position = async (draftPosition) => {
  //While loop variables:
  let go = true
  let dbPosition,
    stopPlaced = false,
    positionEntered = false,
    positionPostedToDatabase
  let positionInfo
  let isShort = draftPosition.entry < draftPosition.stop
  console.log(`isShort is`, isShort)
  // place entry order
  const returnFromEntry = await exchange.getEntryInfo(draftPosition)

  // Updates current Position with entry being true
  databaseManager.updateDraftPosition(draftPosition, true)
  while (go) {
    // Start tracking pair price
    function getPairsPrices(draftPosition) {
      return new Promise((resolve) => {
        setTimeout(
          async () => {
            return resolve(await pairWatch(draftPosition))
          },
          100,
          draftPosition
        )
      })
    }
    //Get price
    let pairPrice = await getPairsPrices(draftPosition)
    console.log(pairPrice)
    // logic for checking to see if stop was breached
    if (positionEntered !== true) {
      if (
        (isShort && pairPrice > draftPosition.stop) ||
        (!isShort && pairPrice < draftPosition.stop)
      ) {
        //cancel all orders on pair
        //TODO: Error handle if orders aren't cancelled
        console.log('cancelling orders on pair')
        exchange.cancelOrdersOnpair(draftPosition)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })

        // find db current Position and delete:
        // lookup all positions, filter by pair, delete
        databaseManager.deleteDraftPosition(draftPosition)
        // STOPS HERE
        go = false
        return
      }
    }

    if (!positionEntered && !stopPlaced) {
      if (!draftPosition.stopEntered && !draftPosition.positionEntered) {
        console.log('checking to place stop');
        console.log(positionEntered, stopPlaced);
        if (
          (isShort && pairPrice < draftPosition.entry) ||
          (!isShort && pairPrice > draftPosition.entry)
        ) {
          console.log('placing stop');
          const exchangePosInfo = await getPositionInfo(draftPosition)
          if (posInfo != []) {
            // place stop
            positionEntered = true
            stopPlaced = true
            stopOrder(draftPosition, isShort)
              .then(async (res) => {
                //handle error, 404: trigger price too high
                if ((res.success = false)) {
                  console.log('Stop order was not placed', res)
                  exitPosition(draftPosition)
                  return
                }
                if (!positionPostedToDatabase) {
                  dbPosition = await databaseManager.createPosition(
                    draftPosition,
                    exchangePosInfo,
                    returnFromEntry
                  )
                    .then((res) => {
                      console.log('return from createPositon is', res);
                      dbPosition = res
                      console.log('db Position is', dbPosition);
                      positionPostedToDatabase = true
                      return
                    })
                }
                // update draft position with stopPlaced = true
                databaseManager.updateDraftPositionStop(draftPosition, true)
              })
              .catch((err) => {
                console.log(err)
                go = false
                return
              })
            console.log('stop placed and position entered is ', stopPlaced, positionEntered);
          }
        } else {
          console.log('price not quite through entry');
        }
      }
    }
    //If stop was executed, update position in db
    // Check to see if stop order was exected
    // If so, update position

    if (positionEntered = true && stopPlaced === true) {
      // Get stop order Info
      console.log('getting Stop Info')
      const stopOrderInfo = await getStopInfo(draftPosition)
      if (stopOrderInfo.avgFillPrice != null) {
        setTimeout((dbPosition) => {
          console.log('updating Position')
          console.log('dbPosition before updating position is', dbPosition);
          databaseManager.updatePosition(dbPosition, stopOrderInfo)

        }, 1000, dbPosition)
        // STOPS HERE
        go = false
        return
      } else {
        console.log('stop not triggered yet')
      }
    }
  }
  if (!go) {
    console.log('Position function ended');
    return
  }
}

module.exports = concurrentPositons