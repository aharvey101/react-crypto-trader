const ftxrest = require('ftx-api-rest')
const util = require('util')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

module.exports = {
  pairWatch: async function (tradingPairsArray) {
    console.log(
      `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
    )
    console.log('Watching pairs')

    //logic:
    // have function variable that is the prices array
    // function that getsPrices and sets array to the updated getPrices
    // function that calls the getPrices function every second

    const updatePrices = async (time, tpa) => {
      return new Promise((resolve, reject) => {
        setInterval(
          () => {
            // console.log('getting prices')
            getPrices().then((data) => {
              // filter prices by tradingPairsArray
              const toReturn = tpa.map((pair) => {
                return data.result.filter((i) => i.name === pair.pair)
              })
              resolve(toReturn)
            })
          },
          time,
          tpa
        )
      })
    }

    // let go = true
    // function that gets getPrices
    function getPrices() {
      // console.log('Im getting some data')
      return new Promise((resolve, reject) => {
        resolve(
          ftx.request({
            method: 'GET',
            path: '/markets',
          })
        )
      })
    }
    let time = 500
    const gotPrices = await updatePrices(time, tradingPairsArray)
    console.log(gotPrices)
    //function sort prices
    function filterPrices(gotPrices, tpa) {
      return tpa.map((pair) => {
        return gotPrices.result.filter((i) => i.name === pair.pair)
      })
    }
  },
}
