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

managePosition.start = async () => {
  // looks up position, starts position
  const positions = await databaseManager.lookup()
  positions.forEach((position) => {
    managePosition.position(position, (concurrent = true))
  })
}
managePosition.inputNewPosition = (order) => {

  // delete all 'current pos' on that pair
  databaseManager.deleteCurrentPos(order)
  console.log('thing deleted')
  // update database Positions
  databaseManager.currentPositions(order)

  // start managing new position
  managePosition.position(order, false)
}

managePosition.exitPositon = async (order) => {
  const orderExited = await exitPosition(order)
  // update database
  databaseManager.updatePosition(order, orderExited)
  return orderExited
}

managePosition.position = async (order, concurrent) => {
  //logic:

  let isShort = order.entry < order.stop
  console.log(`isShort is`, isShort)
  console.log('concurrent is: ', concurrent)
  // place entry order
  let returnFromEntry
  if (concurrent === false) {
    returnFromEntry = await entryOrder(order, isShort)
    console.log(returnFromEntry)
  }
  let go = true

  while (go) {
    // Start tracking pair price
    function getPairsPrices(order) {
      return new Promise((resolve, reject) => {
        setTimeout(
          async () => {
            return resolve(await pairWatch(order))
          },
          100,
          order
        )
      })
    }
    //Get prices
    let pairPrice = await getPairsPrices(order)

    console.log(pairPrice)
    let positionEntered = false
    // logic for checking to see if stop was breached
    if (positionEntered !== true) {
      if (
        (isShort && pairPrice > order.stop) ||
        (!isShort && pairPrice < order.stop)
      ) {
        //cancel all orders on pair
        //TODO: Error handle if orders aren't cancelled
        console.log('cancelling orders on pair')
        cancelOrdersOnpair(order)
          .then((res) => {
            console.log(res)
          })
          .catch((err) => {
            console.log(err)
          })

        // find db current Position and delete:
        // lookup all positions, filter by pair, delete

        databaseManager.deleteCurrentPos(order)
      }
    }

    let dbPosition
    stopPlaced = false
    // if position has been entered, place stop, get entry Order information and post to database
    if (positionEntered !== true && stopPlaced == false) {
      if (
        (isShort && pairPrice < order.entry) ||
        (!isShort && pairPrice > order.entry)
      ) {
        console.log('placing stop')
        // place stop
        stopOrder(order)
          .then(async (res) => {
            //handle error, 404: trigger price too high
            if ((res.success = false)) {
              console.log('Stop order was not placed', res)
              exitPosition(order)
              return
            }
            console.log(res)
            //get Entry Order Information
            const positionInfo = await getPositionInfo(order)
            console.log('the position info is', positionInfo)
            //database Entry
            dbPosition = await databaseManager.createPosition(
              order,
              positionInfo,
              returnFromEntry
            )
          })
          .catch((err) => console.log(err))
        positionEntered = true
        stopPlaced = true
      }
    }

    //If stop was executed, update position in db
    // Check to see if stop order was exected
    // If so, update position

    if (positionEntered != false) {
      // Get stop order Info
      stopOrderInfo = await getStopInfo(order)
      if (stopOrderInfo.averageFillPrice != null) {
        databaseManager.updatePosition(dbPosition, stopOrderInfo)
        // STOPS HERE
        return
      }
    }
  }
}

module.exports = managePosition
