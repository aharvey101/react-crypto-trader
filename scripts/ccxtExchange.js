const CCXT = require('ccxt');

const ftxccxt = new CCXT.ftx({
  enableRateLimit: true,
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  headers: {
    'FTX-SUBACCOUNT': 'testhook',
  },
  options: {
    cancelOrder: {
      method: 'privateDeleteConditionalOrdersOrderId'
    }
  }
})

const ccxtExchange = {}

ccxtExchange.entry = async (order, isShort) => {
  console.log(order);
  const side = isShort ? 'sell' : 'buy'
  console.log('side is', side);
  const { pair, entry, positionSize } = order
  const ccxtOverride = {
    'orderPrice': entry
  }
  // destructure elements from order

  const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, entry, ccxtOverride)
    .catch(err => console.log(err))
  return response
}

ccxtExchange.stop = async (order, isShort) => {
  console.log(order);
  const side = isShort ? 'buy' : 'sell'
  const { pair, exit, positionSize } = order
  const ccxtOverride = {
    'orderPrice': exit
  }
  const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, exit)

  return response
}

ccxtExchange.getBalance = async () => {
  const response = await ftxccxt.fetchBalance(params = {})
  // .then(result => { console.log(result); })
  return response.free.USD
}

ccxtExchange.cancelAllOrders = async (order) => {
  const res = await ftxccxt.cancelAllOrders(order.pair)
  return res
}

module.exports = ccxtExchange