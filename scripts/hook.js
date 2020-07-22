const ccxtExchange = require('../scripts/ccxtExchange')
const FTXWS = require('ftx-api-ws')

const ws = new FTXWS({ apiKey: process.env.API_KEY, secret: process.env.API_SECRET })


// LOGIC

const hook = {}
hook.start = async (order) => {
  // - [X] Setup variables; positionEntered, stopPlaced, isShort
  let dbPosition,
    stopPlaced = false,
    positionEntered = false
  // - [X] Calculate isShort
  const isShort = order.entry > order.exit ? false : true
  // - [X] Place entry order
  ccxtExchange.entry(order, isShort)
    .then(result => {
      console.log(result);
    })
  // - [X] start watching price with websocket
  await ws.connect()
    .then(console.log('connected'))
  await ws.subscribe('ticker', order.pair)
  ws.on(`${order.pair}::ticker`, async (res) => {
    // - [X] If price breaches stop before entry, cancel all orders and return
    const price = res.last
    console.log('price is', price);
    if (!positionEntered) {
      if ((isShort && price > order.exit) || (!isShort && price < order.exit)) {
        // stop breached:
        console.log('Stop breached, cancelling Orders')
        ccxtExchange.cancelAllOrders(order)
          .then(res => {
            console.log(res),
              ws.terminate()
            return
          })
          .catch(err => console.log(err))
      }
    }
    // - [X] if price goes through entry, place stop order
    // - [X] Place stop order after entry
    if (!positionEntered) {
      if ((!isShort && price >= order.entry) || (isShort && price <= order.entry)) {
        // place stop
        const exitOrder = await ccxtExchange.stop(order)
        console.log(exitOrder);
        positionEntered = true;
        //stop websocket connection
        ws.terminate()
        return
      }
    }
  })
}

// - [] 

module.exports = hook