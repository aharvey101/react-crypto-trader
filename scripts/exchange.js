require('dotenv').config()
const ftxrest = require('ftx-api-rest')
const CCXT = require('ccxt')
const ftxccxt = new CCXT.ftx({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
  headers: {
    'FTX-SUBACCOUNT': process.env.NODE_ENV === 'production' ? 'initial' : 'testaccount'
  }
})

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.NODE_ENV === 'production' ? 'initial' : 'testaccount',
})

const exchange = {
  entryOrder: async function (order, isShort) {
    const { pair, positionSize, entry: entryPrice, stop: stopPrice } = order
    const side = isShort ? 'sell' : 'buy'
    const ccxtOverride = {
      'orderPrice': isShort ? entryPrice * 0.998 : entryPrice * 1.002
    }
    const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, entryPrice, ccxtOverride)
      .then(res => {
        return res
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    return response
  },
  stopOrder: async function (order, isShort) {
    const { pair, positionSize, stop: stopPrice } = order
    console.log('isShort in stopOrder function is:', isShort)
    console.log(order)
    const side = isShort ? 'buy' : 'sell'
    const response = await ftxccxt.createOrder(pair, 'stop', side, positionSize, stopPrice, params = { 'reduceOnly': true })
      .then(res => {
        return res
      })
      .catch((err) => {
        console.log(err)
        return false
      })
    return response
  },

  cancelOrdersOnpair: async function (order) {
    const response = await ftx.request({
      method: 'DELETE',
      path: '/orders',
      data: {
        market: order.pair
      }
    })
      .catch(err => console.log(err))
    // const response = await ftxccxt.privateDeleteOrders(order.pair)
    return response
  },
  getPositionInfo: async function (order) {

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
      if (position.size !== 0 && position.future === order.pair) {
        console.log(position);
        return true
      } else {
        return false
      }
    })

    console.log('the position is', newRes)
    return newRes


  },
  exitPosition: async (order, isShort) => {
    const { pair, positionSize, stop: stopPrice } = order
    console.log(order)
    console.log('exiting position')
    const side = isShort ? 'buy' : 'sell'
    const response = await ftxccxt.createOrder(pair, 'market', side, positionSize, stopPrice, params = { 'reduceOnly': true })

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
  getEntryInfo: async (order) => {
    const response = await ftx.request({
      method: 'GET',
      path: `/conditional_orders/history?market=${order.pair}`,
    })
    return response.result[0]
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
