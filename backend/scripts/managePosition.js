const {
  entryOrder,
  stopOrder,
  cancelOrdersOnpair,
  getEntryOrderInformation,
} = require('./orderManager')
const { pairWatch } = require('./pairManager')
const databaseManager = require('./databaseManager')

async function managePosition(order) {
  // One order per call of this function
  let shouldGo = true
  let isShort = order.entry < order.stopPrice
  // place entry order
  // entryOrder(order, isShort)
  while (shouldGo) {
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
      alreadyEntered = true
      // if (
      //   (isShort && pairPrice < order.entry) ||
      //   (!isShort && pairPrice > order.entry)
      // ) {
      console.log('placing stop')
      // // place stop
      const response = await stopOrder(order)
      console.log(response)

      //get Entry Order Information
      // const entryOrderInfo = await getEntryOrderInformation(order)
      // console.log(entryOrderInfo)
      //database Entry
      // databaseManager(order, entryOrderInfo.result)
      // }
    }
  }
}

module.exports = managePosition
