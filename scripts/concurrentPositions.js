const exchange = require('./exchange')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')
const concurrentPositons = {}

concurrentPositons.start = async () => {
  // looks up draftPositions, starts position
  const positions = await databaseManager.lookup()
  positions.forEach((position) => {
    concurrentPositons.position(position)
  })
}

concurrentPositons.position = async (draftPosition) => {
  // define isShort
  let isShort = draftPosition.entry < draftPosition.stop

  // Get entry order Information
  const entryOrderInfo = await exchange.getEntryInfo()
  // start loop
  let go = true
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
    let pairPrice = await getPairsPrices(draftPosition, entryOrderInfo)
    console.log(pairPrice)

    let positionEntered
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
        databaseManager.deleteCurrentPos(draftPosition)
        // STOPS HERE
        go = false
        return
      }
    }
    // -[] TEST THIS FUNCTION
    let dbPosition,
      stopPlaced
    // if position has been entered, place stop, get entry Order information and post to database
    if (stopPlaced !== true && positionEntered !== true) {
      if (
        (isShort && pairPrice < draftPosition.entry) ||
        (!isShort && pairPrice > draftPosition.entry)
      ) {
        console.log('placing stop')
        // place stop
        exchange.stopOrder(draftPosition)
          .then(async (res) => {
            //handle error, 404: trigger price too high
            if ((res.success = false)) {
              console.log('Stop order was not placed', res)
              exitPosition(draftPosition)
              return
            }
            console.log('stopOrder res is ', res)
            //get Entry Order Information
            const positionInfo = await exchange.getPositionInfo(draftPosition)
              .then(async (position) => {
                //database Entry
                dbPosition = await databaseManager.createPosition(
                  draftPosition,
                  position,
                  returnFromEntry
                )
              })
            console.log('the position info is', positionInfo)

          })
          .catch((err) => {
            console.log(err)
            go = false
            return
          })
        positionEntered = true
        stopPlaced = true
        console.log('stop placed and position entered is ', stopPlaced, positionEntered);
      }
    }

    //If stop was executed, update position in db
    // Check to see if stop order was exected
    // If so, update position

    if (positionEntered === true) {
      // Get stop order Info
      const stopOrderInfo = await exchange.getStopInfo(draftPosition)
      console.log('the stopOrderInfo is ', stopOrderInfo);
      if (stopOrderInfo.avgFillPrice != null) {
        databaseManager.updatePosition(dbPosition, stopOrderInfo)
        // STOPS HERE
        go = false
        return
      }
    }
  }
  if (!go) {
    console.log('Position function ended');
    return
  }
}

module.exports = concurrentPositons