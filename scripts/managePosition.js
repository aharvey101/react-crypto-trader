const {
  entryOrder,
  stopOrder,
  cancelOrdersOnpair,
  getPositionInfo,
  getStopInfo,
  exitPosition,
} = require('./exchange')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')
const managePosition = {}


managePosition.inputNewPosition = (draftPosition) => {

  // delete all 'current pos' on that pair
  databaseManager.deleteCurrentPos(draftPosition)
    .then(() => {
      console.log('previous pair deleted from database')
      // start managing new position
      managePosition.position(draftPosition, false)
    })
    .catch(err => {
      console.log(err);
    })

}
//- [] Currently wont work as there is no id in the input of this function. need to fix on the front end
managePosition.exitPositon = async (position) => {
  const stopOrderInfo = await exitPosition(position)
  // update database
  // databaseManager.updatePosition(position, stopOrderInfo)
  return stopOrderInfo
}

managePosition.position = async (draftPosition) => {
  //logic:

  let isShort = draftPosition.entry < draftPosition.stop
  console.log(`isShort is`, isShort)
  console.log('concurrent is: ', concurrent)
  // place entry order

  const returnFromEntry = await entryOrder(draftPosition, isShort)
    .catch(err => {
      console.log(err)
      return
    });
  const currentPos = await databaseManager.updateCurrentPos(draftPosition, true)

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
    let pairPrice = await getPairsPrices(draftPosition)
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
        cancelOrdersOnpair(draftPosition)
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
        stopOrder(draftPosition)
          .then(async (res) => {
            //handle error, 404: trigger price too high
            if ((res.success = false)) {
              console.log('Stop order was not placed', res)
              exitPosition(draftPosition)
              return
            }
            console.log('stopOrder res is ', res)
            //get Entry Order Information
            const positionInfo = await getPositionInfo(draftPosition)
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
      const stopOrderInfo = await getStopInfo(draftPosition)
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

module.exports = managePosition
