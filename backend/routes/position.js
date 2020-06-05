const express = require('express')
const router = express.Router()
const position = require('../scripts/position')
const pairWatch = require('../scripts/pairWatch')
const Position = require('../Models/position')
const ftxrest = require('ftx-api-rest')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

let tradingPairsArray = []
router.post('/', async (req, res) => {
  let pair = req.body.pair
  console.log(`the pair variable = ${JSON.stringify(pair)}`)
  let tradingPairsObject = {
    pair: pair,
  }

  function push(tpa, tpo) {
    console.log(tpo.pair)
    if (tpa.includes(tpo.pair)) {
      return console.log('pair already included')
    } else {
      tradingPairsArray.push(tradingPairsObject)
    }
  }
  push(tradingPairsArray, tradingPairsObject)
  console.log(`the trading Pairs Array is ${JSON.stringify(tradingPairsArray)}`)

  // Push position to database, only temporary, will need to actually push position when entry is executed in future

  //create position
  const ncp = {
    pair: req.body.pair,
    amount: req.body.amount,
    entry: req.body.entry,
    stop: req.body.stop,
    timeframe: req.body.timeframe,
  }
  Position.create(ncp, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated)
    }
  })

  console.log('they be posting orders')
  const order = req.body
  console.log(order)
  // position.placeOrder(order)
  // const prices = pairWatch.pairWatch(tradingPairsArray)

  // write pairwatch into here for now

  let prices = []
  function pairWatch(tpa, prices) {
    console.log(
      `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
    )
    console.log('Watching pairs')
    function getPrices(tpa, p) {
      ftx
        .request({
          method: 'GET',
          path: '/markets',
        })
        .then((res) => {
          return (p = sort(res, tpa))
          // console.log(p/ )
          function sort(res, tpa) {
            //map over trading Pairs Array, filter server results by each item in trading Pairs Array
            return tpa.map((pair) => {
              return res.result.filter((i) => i.name === pair.pair)
            })
          }
        })
    }

    function timer(delayTime) {
      return new Promise(function (resolve) {
        setInterval(function () {
          let response = getPrices(tpa, prices)
          console.log(`response is ` + response)
          resolve(getPrices(tpa, prices))
        }, delayTime)
      })
    }

    timer(1000).then(function (t) {
      console.log(t)
    })
  }
  const p = pairWatch(tradingPairsArray, prices)
  console.log(prices)

  res.send('recieved order' + JSON.stringify(order))
})

module.exports = router
