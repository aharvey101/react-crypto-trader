const express = require('express')
const router = express.Router()
const position = require('../scripts/position')
const pairWatch = require('../scripts/pairWatch')

let tradingPairsArray = []
router.post('/', (req, res) => {
  let pair = req.body.pair
  console.log(`the pair variable = ${pair}`)
  let tradingPairsObject = {
    pair: pair,
    price: req.body.price,
  }

  tradingPairsArray.push(tradingPairsObject)
  console.log(`the trading Pairs Array is ${tradingPairsArray}`)

  console.log('they be posting orders')
  const order = req.body
  // position.placeOrder(order)
  pairWatch.pairWatch(tradingPairsArray)
  res.send('I placed the order')
})

module.exports = router
