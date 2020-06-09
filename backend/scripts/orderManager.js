const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

// the pairwatch function should be

module.exports = {
  entryOrder: function (order, isShort) {
    const {
      pair,
      positionSize: amount,
      entry: entryPrice,
      stop: stopPrice,
    } = order

    console.log(entryPrice + ' ' + stopPrice)

    let entrySide, entryType, entryTriggerPrice

    if (isShort) {
      console.log('position is short')
      // Short entry Paramaters
      entrySide = 'sell'
      entryType = 'stop'
      entryTriggerPrice = entryPrice
    } else if (!isShort) {
      // Long entry Paramaters
      entrySide = 'buy'
      entryType = 'stop' //stop limit, so use a conditional order with a trigger price
      entryTriggerPrice = entryPrice
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
  stoporder: function (order, isShort) {
    const {
      pair,
      positionSize: amount,
      entry: entryPrice,
      stop: stopPrice,
    } = order

    let stopSide, stopType

    if (isShort) {
      // Short stop paramaters
      stopSide = 'buy'
      stopType = 'stop'
    } else {
      //Long stop paramaters
      stopSide = 'sell'
      stopType = 'stop'
    }
    ftx
      .request({
        method: 'POST',
        path: '/conditional_orders',
        data: {
          market: pair,
          type: stopType,
          side: stopSide,
          price: stopPrice,
          size: amount,
        },
      })
      .then((res) => {
        console.log(res)
      })
      .catch((err) => console.log(err))
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
