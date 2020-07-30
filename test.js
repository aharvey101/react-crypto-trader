require('dotenv').config()
const exchange = require('./scripts/exchange')

const order = {
  pair: 'ETH-PERP',
  entry: 300,
  stop: 300,
  positionSize: 0.001,
}

const isShort = false

async function test(order, isShort) {
  // const response = await exchange.entryOrder(order, isShort)
  const stopOrderResponse = await exchange.stopOrder(order, isShort)
  console.log(stopOrderResponse);

  const cancelOrders = await exchange.cancelOrdersOnpair(order)

  console.log(cancelOrders);
}

test(order, isShort)