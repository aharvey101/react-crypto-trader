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
  const side = 'buy' ? isShort : 'sell'
  const ccxtOverride = {
    'orderPrice': entry
  }
  // destructure elements from order
  const { pair, entry, positionSize } = order

  const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, entry, ccxtOverride)
  return response
}

ccxtExchange.stop = async (order, isShort) => {
  console.log(order);
  const side = 'sell' ? isShort : 'buy'
  const ccxtOverride = {
    'orderPrice': entry
  }
  const { pair, exit, positionSize } = order
  const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, exit, ccxtOverride)

  return response
}

ccxtExchange.getBalance = async () => {
  const response = await ftxccxt.fetchBalance(params = {})
  // .then(result => { console.log(result); })
  return response.free.USD
}

ccxtExchange.cancelAllOrders = async (order) => {
  ftxccxt.cancelAllOrders(order.pair)
}

module.exports = ccxtExchange