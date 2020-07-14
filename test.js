require('dotenv').config()
const ftxrest = require('ftx-api-rest')
const mongoose = require('mongoose')
const { position } = require('./scripts/managePosition')
const Position = require('./Models/position')
const { response } = require('express')


const uri = process.env.DATABASEURI
mongoose
  .connect(process.env.MONGODB_URI || uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .catch((err) => console.log(err))



const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.PRODUCTION ? 'initial' : '',
})

const draftPosition = {
  pair: 'ETH-PERP',
  positionSize: 0.01,
  entry: 300,
  stop: 200,
}

const isShort = draftPosition.entry < draftPosition.stop ? true : false

//testing place entry, place stop get fills

const run = async function (draftPosition, isShort) {
  const entry = await entryOrder(draftPosition, isShort)
  const stop = await stopOrder(draftPosition, isShort)

  const newPosition = {
    pair: draftPosition.pair,
    positionSize: draftPosition.positionSize,
    entry: draftPosition.entry,
    stop: draftPosition.stop,
    timeframe: draftPosition.timeframe,
    tf1: draftPosition.tf1,
    tf2: draftPosition.tf2,
    tf3: draftPosition.tf3,
    date: new Date(),
    entryOrder: entry,
    // position: exchangePostionInfo,
    stopOrder: stop
  }

  Position.create(newPosition, function (
    err,
    newlyCreated
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `the newly created position is:`, newlyCreated
      )
    }
    return newlyCreated
  })
}
run(draftPosition, isShort)
async function entryOrder(draftPosition, isShort) {
  const { pair, positionSize, entry: entryPrice, stop: stopPrice } = draftPosition
  const response = await ftx
    .request({
      method: 'POST',
      path: '/orders',
      data: {
        market: pair,
        type: 'market',
        side: isShort ? 'sell' : 'buy',
        price: entryPrice,
        size: positionSize,
        triggerPrice: entryPrice,
      },
    }).then(res => {
      if (res.success = false) {
        return false
      }
      return res
    })
    .catch((err) => {
      console.log(err)
      return { err: true }
    })
  return response.result
}

async function stopOrder(draftPosition, isShort) {
  const { pair, positionSize, stop: stopPrice } = draftPosition
  console.log('isShort in stopOrder function is:', isShort)

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
    .then(res => {
      if (res.success = false) {
        console.log('stop order success is in function is', res.result);
      }
      return res
    })
    .catch((err) => {
      console.log(err),
        console.log('caught error from exchange');
    })
  return response.result
}

