const CCXT = require('ccxt');

const ftxccxt = new CCXT.ftx({
  enableRateLimit: true,
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  options: {
    cancelOrder: {
      method: 'privateDeleteConditionalOrdersOrderId'
    }
  }
})


const ccxtExchange = {}

ccxtExchange.entry = async (order) => {
  console.log(order);
  // calculate isShort
  const isShort = order.entry > order.exit ? false : true
  // destructure elements from order


}