const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

// the pairwatch function should be

module.exports = {
  placeOrder: function (order) {
    const {
      pair,
      positionSize: amount,
      entry: entryPrice,
      stop: stopPrice,
    } = order

    console.log(entryPrice + ' ' + stopPrice)

    let entrySide,
      entryType,
      entryTriggerPrice,
      stopSide,
      stopType,
      cancelPrice,
      isShort = false

    if (isShort) {
      console.log('position is short')
      // Short entry Paramaters
      entrySide = 'sell'
      entryType = 'stop'
      entryTriggerPrice = entryPrice

      // Short exit paramaters
      stopSide = 'buy'
      stopType = 'stop'
      cancelPrice = stopPrice - 0.01
    } else if (!isShort) {
      // Long entry Paramaters
      entrySide = 'buy'
      entryType = 'stop' //stop limit, so use a conditional order with a trigger price
      entryTriggerPrice = entryPrice + 0.01

      //Long stop paramaters
      stopSide = 'sell'
      stopType = 'stop'
      cancelPrice = stopPrice + 0.01
    }

    ftx
      .request({
        method: 'POST',
        path: '/conditional_orders',
        data: {
          market: pair,
          type: entryType,
          side: entrySide,
          price: entryPrice,
          size: amount,
          triggerPrice: entryTriggerPrice,
        },
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => console.log(err))
  },
  //Stop watch function is for watching to mare sure that in the event of the stop being breached before entry,
  // the entry order is cancelled and position is closed
  stopWatch: function (order) {
    console.log('I watch for the stop to be breached')
  },

  // Position entry function,
  // this function takes in the pair price, if entry order is executed, posts stoploss order and post position to database
  positionEntry: function (order, price) {
    console.log('I do things once the position has been entered ')
    const { pair, amount, entry: entryPrice, stop: stopPrice } = order
    // Logic:
    //  if order has been filled (avg price?) place stoploss

    if (
      //if long
      (entryPrice > stopPrice && price.pair >= entryPrice) ||
      //if short
      (entryPrice < stopPrice && price.pair <= entryPrice)
    ) {
    }
  },
}
