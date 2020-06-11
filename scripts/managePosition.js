const {
  entryOrder,
  stopOrder,
  cancelOrdersOnpair,
  getPositionInfo,
  getStopInfo,
} = require('./exchange')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')

let pairsWithOrdersArray = []
function inputNewPosition(order) {
  //update pairsWithOrdersArray
  function updateOrdersArray(order) {
    pairsWithOrdersArray.push(order)
  }
  updateOrdersArray(order)
  console.log(pairsWithOrdersArray)
  // start managing new position
  managePosition(order)
}

console.log(pairsWithOrdersArray)

async function managePosition(order) {
  //logic:
  let shouldGo = true
  let isShort = order.entry < order.stopPrice
  // place entry order
  entryOrder(order, isShort)
  while (shouldGo) {
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
    let alreadyEntered = false
    // logic for checking to see if stop was breached
    if (alreadyEntered !== true) {
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
        return
      }
    }
    let dbPosition
    // if position has been entered, place stop ,get entry Order information and post to database
    if (alreadyEntered !== true) {
      if (
        (isShort && pairPrice < order.entry) ||
        (!isShort && pairPrice > order.entry)
      ) {
        console.log('placing stop')
        // place stop
        stopOrder(order)
          .then((result) => console.log(result))
          .catch((err) => console.log(err))

        //get Entry Order Information
        const positionInfo = await getPositionInfo(order)

        //database Entry
        dbPosition = await databaseManager(order, positionInfo)
        alreadyEntered = true
      }
    }

    // if stop was executed?
    const stopOrderInfo = await getStopInfo(order)
    if (stopOrderInfo.result.averageFillPrice !== null) {
      databaseManager.updatePosition(dbPosition, stopOrderInfo)
      return
    }
  }
}

module.exports = inputNewPosition
