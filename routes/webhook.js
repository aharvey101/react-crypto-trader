const express = require('express')
const router = express.Router()
const ccxtExchange = require('../scripts/ccxtExchange')
const CCXT = require('ccxt')
const hook = require('../scripts/hook')

router.post('/', async (req, res) => {

  //Get alertData info
  const alertData = req.body
  // calculate position Size
  // 1. Get account Size
  const balance = await ccxtExchange.getBalance()
  console.log(balance);
  // // 2. make position size
  const tradeRisk = 1 - alertData.exit / alertData.entry
  const newTradeAmount =
    (balance * 0.01) / tradeRisk
  const newPositionSize = newTradeAmount / alertData.entry
  console.log(newPositionSize);
  const order = {
    entry: alertData.entry,
    exit: alertData.exit,
    positionSize: // if positionSize is negative, make it positive
      newPositionSize < 0 ? newPositionSize * -1 : newPositionSize,
    pair: alertData.pair
  }
  hook.start(order)


  res.send('recieved alertData' + JSON.stringify(alertData))
})

module.exports = router