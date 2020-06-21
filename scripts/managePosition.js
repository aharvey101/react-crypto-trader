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
    managePosition.position(position, true)
  })
}
managePosition.inputNewPosition = (order) => {

  // delete all 'current pos' on that pair
  databaseManager.deleteCurrentPos(order)
    .then((res) => {
      console.log(res);
      console.log('previous pair deleted from database')
    })
    .then(() => {
      // update database Positions
      databaseManager.currentPositions(order)
    })
    .catch(err => {
      console.log(err);
    })

  // start managing new position
  managePosition.position(order, false)
}
//- [] Currently wont work as there is no id in the input of this function. need to fix on the front end
managePosition.exitPositon = async (position) => {
  const stopOrderInfo = await exitPosition(position)
  // update database
  databaseManager.updatePosition(position, stopOrderInfo)
  return stopOrderInfo
}

managePosition.position = async (order, concurrent) => {
  //logic:

  let isShort = order.entry < order.stop
  console.log(`isShort is`, isShort)
  console.log('concurrent is: ', concurrent)
  // place entry order
  async function checkEntryDone(order) {
    if (concurrent === false) {
      const returnFromEntry = await entryOrder(order, isShort)
        .then((res) => {
          // update current Postitions collection with entryOrder
          console.log('res is:', res);
        })
        .catch(err => {
          console.log(err)
          return
        });
      return returnFromEntry
    }
  }


  checkEntryDone(order).then(async (entryOrder) => {
    let go = true
    while (go) {
      // Start tracking pair price
      function getPairsPrices(order) {
        return new Promise((resolve) => {
          setTimeout(
            async () => {
              return resolve(await pairWatch(order))
            },
            100,
            order
          )
        })
      }
      //Get price
      let pairPrice = await getPairsPrices(order)
      console.log(pairPrice)

      let positionEntered
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
          // STOPS HERE
          go = false
          return
        }
      }
      // -[] TEST THIS FUNCTION
      let dbPosition,
        stopPlaced
      // if position has been entered, place stop, get entry Order information and post to database
      if (positionEntered !== true && stopPlaced !== true) {
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
                entryOrder
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

      if (positionEntered === true) {
        // Get stop order Info
        const stopOrderInfo = await getStopInfo(order)
        if (stopOrderInfo.averageFillPrice != null) {
          databaseManager.updatePosition(dbPosition, stopOrderInfo)
          // STOPS HERE
          go = false
          return
        }
      }
    }
  })
  if (!go) {
    console.log('Position function ended');
    return
  }
}

module.exports = managePosition
