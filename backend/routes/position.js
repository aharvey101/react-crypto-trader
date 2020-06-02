const express = require('express')
const router = express.Router()
const position = require('../scripts/position')
const pairWatch = require('../scripts/pairWatch')
const Position = require('../Models/position')

let tradingPairsArray = []
router.post('/', (req, res) => {
  let pair = req.body.pair
  console.log(`the pair variable = ${JSON.stringify(pair)}`)
  let tradingPairsObject = {
    pair: pair,
  }

  function push(tpa, tpo) {
    console.log(tpo.pair)
    if (tpa.includes(tpo.pair)) {
      return console.log('pair already included')
    } else {
      tradingPairsArray.push(tradingPairsObject)
    }
  }
  push(tradingPairsArray, tradingPairsObject)
  console.log(`the trading Pairs Array is ${JSON.stringify(tradingPairsArray)}`)

  // Push position to database, only temporary, will need to actually push position when entry is executed in future

  //create position
  const ncp = {
    pair: req.body.pair,
    amount: req.body.amount,
    entry: req.body.entry,
    stop: req.body.stop,
    timeframe: req.body.timeframe,
  }
  Position.create(ncp, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated)
    }
  })

  console.log('they be posting orders')
  const order = req.body
  // position.placeOrder(order)
  // const prices = pairWatch.pairWatch(tradingPairsArray)

  res.send('I placed the order')
})

module.exports = router
