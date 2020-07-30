require('dotenv').config()
const ftxrest = require('ftx-api-rest')
const CCXT = require('ccxt')

const ftxccxt = new CCXT.ftx({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  // headers: {
  //   'FTX-SUBACCOUNT': process.env.PRODUCTION ? 'initial' : ''
  // }
})

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.PRODUCTION ? 'initial' : '',
})

const exchange = {
  entryOrder: async function (draftPosition, isShort) {
    const { pair, positionSize, entry: entryPrice, stop: stopPrice } = draftPosition
    const side = isShort ? 'sell' : 'buy'
    const ccxtOverride = {
      'orderPrice': entryPrice * 1.0002
    }
    const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, entryPrice, ccxtOverride)
      .then(res => {
        return res
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    console.log(response);
    return response
  },
  stopOrder: async function (draftPosition, isShort) {
    const { pair, positionSize, stop: stopPrice } = draftPosition
    console.log('isShort in stopOrder function is:', isShort)
    console.log(draftPosition)
    const side = isShort ? 'buy' : 'sell'
    const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, stopPrice, params = { 'reduceOnly': true })
      .then(res => {
        return res
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    console.log('stop order in stop order function is', response);
    return response
  },

  cancelOrdersOnpair: async function (draftPosition) {
    console.log('cancelOrdersOnpair')
    const response = await ftxccxt.cancelAllOrders(draftPosition.pair)
      .catch(err => console.log(err))
    // const response = await ftx.request({
    //   method: 'DELETE',
    //   path: '/orders',
    //   data: {
    //     market: draftPosition.pair,
    //   },
    // })
    return response
  },
  getPositionInfo: async function (draftPosition) {

    async function wait() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          return resolve(getPositions())
        }, 1000)
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
