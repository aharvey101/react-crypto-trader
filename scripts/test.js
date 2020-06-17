const exchange = require('./exchange')
const dbManager = require('./databaseManager')

const order = {
  pair: 'BTC-PERP',
  stop: 10000,
  positionSize: 0.005,
  entry: 9000,
  date: new Date(),
}
const isShort = true

const stopOrder = {
  id: 1235188,
}

async function getPos(order) {
  const pos = await exchange.getPositionInfo(order)
  return pos
}

const posInfo = getPos(order)

console.log('position is ', posInfo)

async function updatePosition(pos, stop) {
  const info = await dbManager.updatePosition(pos, stop)
  console.log(info)
}

updatePosition(posInfo, stopOrder)
