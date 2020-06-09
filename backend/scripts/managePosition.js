const orderManager = require('./orderManager')
const pairManager = require('./pairManager')
const databaseManager = require('./databaseManager')``
async function managePosition(order) {
  // make array for storing pairs to track their price
  let tradingPairsArray = []
  let pair = order.pair
  console.log(`the pair variable = ${JSON.stringify(pair)}`)
  let tradingPairsObject = {
    pair: pair,
  }
  console.log(tradingPairsObject)
  //pushes object into array
  function push(tpa, tpo) {
    console.log(tpo.pair)
    // // this doesn't work but needs to exist
    // if (tpa.filter((pair) => pair === tpo.pair)) {
    //   return console.log('pair already included')
    // } else {
    // }
    return tpa.push(tpo)
  }
  const newPairsArray = push(tradingPairsArray, tradingPairsObject)
  console.log(newPairsArray)

  //detect if short
  let isShort = order.entry < order.stopPrice

  //stop breach

  function stopBreach() {}

  console.log(`the trading Pairs Array is ${JSON.stringify(tradingPairsArray)}`)
  // place entry order
  // orderManager.entryOrder(order, isShort)

  const pairs = await pairManager.pairWatch(tradingPairsArray)
  console.log(pairs)

  // these functions need to be moduled out later into the databaseManager script, however, rn, they are here
}

module.exports = managePosition
