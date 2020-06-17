const exchange = require('./exchange')
require('dotenv').config()

const order = {
  pair: 'ETH-PERP',
}

const stopOrder = {
  id: 1235188,
}

async function getStopOrderInfo(stopOrder, pair) {
  const info = await exchange.getStopInfo(stopOrder, pair)
  console.log(info)
}

getStopOrderInfo(stopOrder, order)
