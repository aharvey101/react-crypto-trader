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
    .then((res) => {
      console.log('deleted', res);
    })
    .then(() => {
      databaseManager.currentPositions(draftPosition)
        .then((res) => {
          console.log('draft position in db is ', res);
        })
    })
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
  //While loop variables:
  let go = true
  let dbPosition,
    stopPlaced,
    positionEntered
  let positionInfo
  let isShort = draftPosition.entry < draftPosition.stop
  console.log(`isShort is`, isShort)
  // place entry order
  // fix this if order doesn't go through: ie: trigger price to low
  let returnFromEntry
  await entryOrder(draftPosition, isShort)
    .then((res) => {
      returnFromEntry = res
    })
    .then((res) => {
      if (res = false) {
        go = false
        return
      }
    })
    .catch(err => {
      console.log('tehre was an error', err)
      go = false
      return
    });
  console.log('return from entry is', returnFromEntry);
  // Updates current Position with entry being true
  const currentPos = await databaseManager.updateCurrentPos(draftPosition, true)
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
    // -[x] TEST THIS FUNCTION

    // Ask server for position info. if position info array is not empty,
    // place stop and update database position
    if (stopPlaced !== true && positionEntered !== true) {
      if (
        (isShort && pairPrice < draftPosition.entry) ||
        (!isShort && pairPrice > draftPosition.entry)
      ) {
        const posInfo = await getPositionInfo(draftPosition)
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
              dbPosition = await databaseManager.createPosition(
                draftPosition,
                posInfo,
                returnFromEntry
              )
              // =================================
              // STOPS HERE
              go = false
              return
              // =================================
            })
            .catch((err) => {
              console.log(err)
              go = false
              return
            })
          console.log('stop placed and position entered is ', stopPlaced, positionEntered);

        }
      }
    }
    //If stop was executed, update position in db
    // Check to see if stop order was exected
    // If so, update position

    // if (positionEntered = true && stopPlaced === true) {
    //   // Get stop order Info
    //   console.log('getting Stop Info')
    //   const stopOrderInfo = await getStopInfo(draftPosition)
    //   if (stopOrderInfo.avgFillPrice != null) {
    //     setTimeout(() => {
    //       console.log('updating Position')
    //       databaseManager.updatePosition(dbPosition, stopOrderInfo)

    //     }, 5000)
    //     // STOPS HERE
    //     go = false
    //     return
    //   } else {
    //     console.log('stop not triggered yet')
    //   }
    // }
  }
  if (!go) {
    console.log('Position function ended');
    return
  }
}

module.exports = managePosition
