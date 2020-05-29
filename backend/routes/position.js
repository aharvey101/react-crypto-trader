const express = require('express')
const router = express.Router()
const position = require('../scripts/position')
const pairWatch = require('../scripts/pairWatch')

router.post('/', (req, res) => {
  let pair = req.body.pair
  let tradingPairsArray = []
  let tradingPairsObject = {}

  function addPairToArray(pair, tpa) {
    return tpa.push(pair)
  }

  tradingPairsObject = {
    pair: pair,
    price: req.body.price,
  }

  addPairToArray(pair, tradingPairsArray)

  console.log('they be posting orders')
  const order = req.body
  console.log(typeof position.placeOrder)
  // position.placeOrder(order)
  pairWatch.pairWatch(tradingPairsArray, tradingPairsObject)
  res.send('I placed the order')
})

module.exports = router
