const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

const exchange = {
  entryOrder: async function (order, isShort) {
    const { pair, positionSize, entry: entryPrice, stop: stopPrice } = order
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

    if (response.success != true) {
      return false
    }
    return await response
  },
  stopOrder: async function (order, isShort) {
    const { pair, positionSize, stop: stopPrice } = order
    console.log('isShori in stopOrder function is:', isShort)
    console.log(order)

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
      .catch((err) => {
        console.log(err),
          console.log('caught error in exchange');
      })
    return await response
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
  getPositionInfo: async function (order) {
    console.log('getting Entry Order Information', order)
    function promiseResolve() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve(async () => {
            const res = await ftx.request({
              method: 'GET',
              path: '/positions',
              data: {
                showAvgPrice: true,
              },
            })
            return res
          })
        }, 1000)
      })
    }
    const response = promiseResolve()
    //fitler response

    //TODO:
    //- [] Error handle so that if the position does not exist, it doesn't go on but breaks

    const newRes = await response.result.filter((position) => {
      if (position.size !== 0 && position.future === order.pair) {
        console.log(position);
        return true
      } else {
        return false
      }
    })
    if (newRes = []) {
      process.exit()
    } else {
      console.log('the position is', newRes)
      return newRes
    }

  },
  getStopInfo: async (pair) => {
    const order = await ftx.request({
      method: 'GET',
      path: `/conditional_orders/history?market=${pair.pair}`,
    })
    return order.result[0]
  },
  exitPosition: async (order, isShort) => {
    console.log(order)
    console.log('exiting position')
    const response = await ftx.request({
      method: 'POST',
      path: '/orders',
      data: {
        market: order.pair,
        side: isShort ? 'buy' : 'sell',
        type: 'market',
        size: order.positionSize,
        reduceOnly: true,
        price: order.stop,
      },
    })
    return response
  },
  getPairs: async () => {
    console.log('getting Pairs');
    const response = await ftx.request({
      method: 'GET',
      path: '/markets'
    })
    function filter(response) {
      let perps = response.result.filter(pairObject => {
        if (pairObject.name.includes('-PERP')) {
          return true
        }
      })

      return perps
    }

    return filter(response)
  },
  getEntryInfo: async () => {

  }
}

module.exports = exchange
