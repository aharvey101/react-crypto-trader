const ccxtExchange = require('../scripts/ccxtExchange')
const FTXWS = require('ftx-api-ws')

const ws = new FTXWS({ apiKey: process.env.API_KEY, secret: process.env.API_SECRET })


// LOGIC

const hook = {}
hook.start = async (order) => {
  // - [] Setup variables; positionEntered, stopPlaced, isShort
  let dbPosition,
    stopPlaced = false,
    positionEntered = false
  // - [] Calculate isShort
  const isShort = order.entry > order.exit ? false : true
  // - [] Place entry order
  ccxtExchange.entry(order, isShort)
    .then(result => {
      console.log(result);
    })
  // - [] start watching price with websocket
  await ws.subscribe('ticker', order.pair)
  ws.on(`${order.pair}::ticker`, (res) => {
    // - [] If price breaches stop before entry, cancel all orders and return
    const price = res
    if (!positionEntered) {
      if ((isShort && price.last < order.exit) || (!isShort && price.last > order.exit)) {
        // stop breached:
        console.log('Stop breached, cancelling Orders')
        ccxtExchange.cancelAllOrders(order)
          .then(res => {
            console.log(res),
              ws.terminate()
          })
          .catch(err => console.log(err))
      }
    }
  })
  // - [] if price goes through entry, place stop order
  if (!positionEntered) {
    if ((!isShort && price.last > order.entry) || (isShort && price.last < order.entry)) {
      // place stop
      const exitOrder = await ccxtExchange.stop(order)
      console.log(exitOrder);
      positionEntered = true;
      //stop websocket connection
      ws.close()
      return
    }

  }
}

// - [] 
// - [] Place stop order after entry

module.exports = hook