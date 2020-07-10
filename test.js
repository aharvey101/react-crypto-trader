require('dotenv').config()
const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.PRODUCTION ? 'initial' : '',
})

const draftPosition = {
  pair: 'BTC-PERP',
  positionSize: 0.001,
  entry: 9000,
  stop: 9500,
}

const isShort = draftPosition.entry < draftPosition.stop ? true : false

// testing place entry, place stop get fills

const run = async function (draftPosition, isShort) {
  const entry = await entryOrder(draftPosition, isShort)
  console.log('entry success is', entry);
  const stop = await stopOrder(draftPosition, isShort)
  console.log('stop success is', stop);
}

run(draftPosition, isShort)
async function entryOrder(draftPosition, isShort) {
  const { pair, positionSize, entry: entryPrice, stop: stopPrice } = draftPosition
  const response = await ftx
    .request({
      method: 'POST',
      path: '/conditional_orders',
      data: {
        market: pair,
        type: 'stop',
        side: isShort ? 'sell' : 'buy',
        price: entryPrice,
        size: positionSize,
        triggerPrice: entryPrice,
      },
    })
    .catch((err) => {
      console.log(err)
      return { err: true }
    })
  console.log('entry order was sucessful?:', response.success);
  if (response === { err: true }) {
    return false
  }
  return await response.result
}

async function stopOrder(draftPosition, isShort) {
  const { pair, positionSize, stop: stopPrice } = draftPosition
  console.log('isShori in stopOrder function is:', isShort)

  const response = await ftx
    .request({
      method: 'POST',
      path: '/conditional_orders',
      data: {
        market: pair,
        type: 'stop',
        side: isShort ? 'buy' : 'sell',
        price: stopPrice,
        size: positionSize,
        triggerPrice: stopPrice,
        reduceOnly: true,
      },
    })
    .then(res => {
      console.log(res.result);
    })
    .catch((err) => {
      console.log(err),
        console.log('caught error from exchange');
    })
  return response
}

