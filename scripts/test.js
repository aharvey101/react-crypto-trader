const exchange = require('./exchange')

const order = {
  pair: 'BTC-PERP',
  positionSize: 0.1,
  stop: 10000,
}

const isShort = true
async function postOrder(order, isShort) {
  const response = await exchange.stopOrder(order, isShort)
  console.log(response)
}
postOrder(order, isShort)
