const orderManager = require('./orderManager')
const pairManager = require('./pairManager')
const Position = require('../Models/position')

function managePosition(order) {
  // make array for storing pairs to track their price
  let tradingPairsArray = []
  let pair = order.pair
  console.log(`the pair variable = ${JSON.stringify(pair)}`)
  let tradingPairsObject = {
    pair: pair,
  }

  function push(tpa, tpo) {
    console.log(tpo.pair)
    // this doesn't work but needs to exist
    if (tpa.filter((pair) => pair.pair === tpo.pair)) {
      return console.log('pair already included')
    } else {
      return tradingPairsArray.push(tradingPairsObject)
    }
  }
  push(tradingPairsArray, tradingPairsObject)
  console.log(`the trading Pairs Array is ${JSON.stringify(tradingPairsArray)}`)

  orderManager.placeOrder(order)

  // these functions need to be moduled out later into the databaseManager script, however, rn, they are here

  function newPostionToDB(order) {
    //create position
    const ncp = {
      pair: order.pair,
      amount: order.amount,
      entry: order.entry,
      stop: order.stop,
      timeframe: order.timeframe,
    }
    Position.create(ncp, function (err, newlyCreated) {
      if (err) {
        console.log(err)
      } else {
        //redirect back to campgrounds page
        console.log(newlyCreated)
      }
    })
  }
}

module.exports = managePosition
