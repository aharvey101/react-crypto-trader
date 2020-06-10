const {
  entryOrder,
  stopOrder,
  cancelOrdersOnpair,
  getPositionInfo,
} = require('./orderManager')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')

let pairsWithOrdersArray = []
function inputNewPosition(order) {
  //update pairsWithOrdersArray
  function updateOrdersArray(order) {
    pairsWithOrdersArray.push(order)
  }
  updateOrdersArray(order)
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
    console.log(order)
    // Start tracking pair price
    function getPairsPrices(order) {
      return new Promise((resolve, reject) => {
        console.log('promise made')
        setTimeout(
          async () => {
            console.log('resolving')
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
    // console.log(pairPrice)
    let alreadyEntered = false
    let ordersCancelled = false
    // logic for checking to see if stop was breached
    if (ordersCancelled !== true) {
      if (
        (isShort && pairPrice > order.stop) ||
        (!isShort && pairPrice < order.stop)
      ) {
        //cancel all orders on pair
        console.log('cancelling orders on pair')
        const response = await cancelOrdersOnpair(order)
        console.log(response)
        return response
      }
    }
    // if position has been entered, place stop ,get entry Order information and post to database
    if (alreadyEntered !== true) {
      if (
        (isShort && pairPrice < order.entry) ||
        (!isShort && pairPrice > order.entry)
      ) {
        console.log('placing stop')
        // place stop
        const response = await stopOrder(order)
        console.log(response)

        //get Entry Order Information
        const positionInfo = await getPositionInfo(order)
        console.log(positionInfo)
        //database Entry
        databaseManager(order, positionInfo)
        return
      }
    }
  }
}

module.exports = inputNewPosition
