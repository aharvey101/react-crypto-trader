const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

// the pairwatch function should be

module.exports = {
  entryOrder: async function (order, isShort) {
    const { pair, positionSize, entry: entryPrice, stop: stopPrice } = order

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

    const response = await ftx
      .request({
        method: 'POST',
        path: '/conditional_orders',
        data: {
          market: pair,
          type: entryType,
          side: entrySide,
          price: entryPrice,
          size: positionSize,
          triggerPrice: entryTriggerPrice,
        },
      })
      .catch((err) => console.log(err))
    return response
  },
  //Stop watch function is for watching to mare sure that in the event of the stop being breached before entry,
  // the entry order is cancelled and position is closed
  stopOrder: async function (order, isShort) {
    const { pair, positionSize, stop: stopPrice } = order

    let stopSide,
      stopType,
      stopTriggerPrice = stopPrice

    if (isShort) {
      // Short stop paramaters
      stopSide = 'buy'
      stopType = 'stop'
    } else {
      //Long stop paramaters
      stopSide = 'sell'
      stopType = 'stop'
    }
    const response = await ftx
      .request({
        method: 'POST',
        path: '/conditional_orders',
        data: {
          market: pair,
          type: stopType,
          side: stopSide,
          price: stopPrice,
          size: positionSize,
          triggerPrice: stopTriggerPrice,
        },
      })
      .catch((err) => console.log(err))
    return response
  },

  cancelOrdersOnpair: async function (order, price) {
    console.log('cancelOrdersOnpair')
    const response = await ftx.request({
      method: 'DELETE',
      path: '/orders',
      data: {
        pair: order.pair,
      },
    })
    return response
  },
  getEntryOrderInformation: async function (order, entryOrder) {
    console.log('getting Entry Order Information')
    const response = await ftx.request({
      method: 'GET',
      path: '/positions',
      data: {
        showAvgPrice: true,
      },
    })
    //fitler response
    const newRes = response.result.filter((position) => position.size !== 0)
    return newRes
  },
}
