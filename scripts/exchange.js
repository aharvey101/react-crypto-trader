const ftxrest = require('ftx-api-rest')


const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

const exchange = {
  entryOrder: async function (draftPosition, isShort) {
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
    console.log('entry order was sucessful?:', response);
    if (response === { err: true }) {
      return false
    }
    return await response
  },
  stopOrder: async function (draftPosition, isShort) {
    const { pair, positionSize, stop: stopPrice } = draftPosition
    console.log('isShori in stopOrder function is:', isShort)
    console.log(draftPosition)

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

  cancelOrdersOnpair: async function (draftPosition) {
    console.log('cancelOrdersOnpair')
    const response = await ftx.request({
      method: 'DELETE',
      path: '/orders',
      data: {
        market: draftPosition.pair,
      },
    })
    return response
  },
  getPositionInfo: async function (draftPosition) {
    console.log('getting Entry Order Information', draftPosition)

    async function wait() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve(getPositions())
        }, 100)
      })
    }

    const getPositions = async () => {
      const response = await ftx.request({
        method: 'GET',
        path: '/positions',
        data: {
          showAvgPrice: true,
        },
      })
      return response
    }

    const response = await wait()
    //fitler response
    console.log('testing response', response.result[0]);
    //TODO:
    //- [] Error handle so that if the position does not exist, it doesn't go on but breaks

    const newRes = await response.result.filter((position) => {
      if (position.size !== 0 && position.future === draftPosition.pair) {
        console.log(position);
        return true
      } else {
        return false
      }
    })

    console.log('the position is', newRes)
    return newRes


  },
  getStopInfo: async (draftPosition) => {
    const order = await ftx.request({
      method: 'GET',
      path: `/conditional_orders/history?market=${draftPosition.pair}`,
    })
    return order.result[0]
  },
  exitPosition: async (draftPosition, isShort) => {
    console.log(draftPosition)
    console.log('exiting position')
    const response = await ftx.request({
      method: 'POST',
      path: '/orders',
      data: {
        market: draftPosition.pair,
        side: isShort ? 'buy' : 'sell',
        type: 'market',
        size: draftPosition.positionSize,
        reduceOnly: true,
        price: draftPosition.stop,
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
  getEntryInfo: async (draftPosition) => {
    const order = await ftx.request({
      method: 'GET',
      path: `/conditional_orders/history?market=${draftPosition.pair}`,
    })
    return order.result[0]
  },
  getPositions: async () => {
    const response = await ftx.request({
      method: 'GET',
      path: '/positions'
    })
    const filtered = response.result.filter(position => {
      if (position.size > 0) return true
    })

    return filtered
  }
}

module.exports = exchange
