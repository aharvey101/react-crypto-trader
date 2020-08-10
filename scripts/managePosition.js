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
const exchange = require('./exchange')
const managePosition = {}

const bot = require('./telegramBot')
const chatId = process.env.TELEGRAM_CHAT_ID

//- [] Currently wont work as there is no id in the input of this function. need to fix on the front end
managePosition.exitPositon = async (position) => {
  const stopOrderInfo = await exitPosition(position)
  databaseManager.deleteDraftPosition(position)
    .then((res) => {
      console.log('deleted', res);
    })
  // update database
  // databaseManager.updatePosition(position, stopOrderInfo)
  return stopOrderInfo
}
managePosition.inputNewPosition = (draftPosition) => {

  // delete all 'current pos' on that pair
  databaseManager.deleteDraftPosition(draftPosition)
    .then((res) => {
      console.log('deleted draft positions',);
    })
    .then(() => {
      // create new draft position
      databaseManager.draftPositions(draftPosition)
      //delete all orders on position
      // cancelOrdersOnpair(draftPosition)
    })
    .then(() => {
      console.log('previous pair deleted from database')
      // start managing new position
      setTimeout(() => {
        managePosition.position(draftPosition, false)
      }, 1000)
    })
    .catch(err => {
      console.log(err);
    })

}


managePosition.position = async (draftPosition) => {
  //While loop variables:
  let go = true
  let dbPosition,
    stopPlaced = false,
    positionEntered = false,
    positionPostedToDatabase
  const isShort = draftPosition.entry < draftPosition.stop
  console.log(`isShort is`, isShort)
  // place entry order
  let entryOrderInfo
  await entryOrder(draftPosition, isShort)
    .then((res) => {
      entryOrderInfo = res
      if (res = false) {
        // if order doesn't go through: ie: trigger price to low
        databaseManager.deleteDraftPosition(draftPosition)
        console.log('entry order failed');
        go = false
        return
      }
    })
    .catch(err => {
      console.log('there was an error', err)
      go = false
      return
    });

  // Updates current Position with entry being true
  console.log('updating draft position with entered = true');
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
    // console.log(pairPrice)
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
        databaseManager.deleteDraftPosition(draftPosition)
        // STOPS HERE
        go = false
        return
      }
    }
    // Ask server for position info. if position info array is not empty,
    // place stop and update database position
    if (stopPlaced !== true && positionEntered !== true) {
      // console.log('checking to place stop');
      // console.log(positionEntered, stopPlaced);
      if (
        (isShort && pairPrice <= draftPosition.entry) ||
        (!isShort && pairPrice >= draftPosition.entry)
      ) {
        console.log('placing stop');

        const exchangePosInfo = await getPositionInfo(draftPosition)
        if (exchangePosInfo != []) {
          // place stop
          positionEntered = true
          stopPlaced = true
          stopOrder(draftPosition, isShort)
            .then(async (res) => {

              //handle errors, ie; 404: trigger price too high
              if (res === false) {
                console.log('Stop order was not placed', res)
                exitPosition(draftPosition)
                return
              }
              if (!positionPostedToDatabase) {
                dbPosition = await databaseManager.createPosition(
                  draftPosition,
                  exchangePosInfo,
                  entryOrderInfo,
                  res
                )
                  .then((res) => {
                    dbPosition = res
                    // console.log('db Position is', dbPosition);
                    positionPostedToDatabase = true
                    go = false
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
          bot.sendMessage(chatId, `stop Placed and database position created for: ${draftPosition.pair}`,)

        }
      }
    }

  }
  if (!go) {
    databaseManager.deleteDraftPosition(draftPosition)
    console.log('Position function ended on', draftPosition.pair);
    return
  }
}

module.exports = managePosition
