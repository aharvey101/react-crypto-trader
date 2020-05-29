const ftxrest = require('ftx-api-rest')

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

// The pairwatch function should be called when the server is started,
// When a trade is made, the pair is added to the pairs array and that is watched

// We are trying to have an object stored globally containing price of pairs
// That we can use as inputs into other functions

// the function takes in the current trading pairs array and the tradingsPairsObject
// it loops over the array and for each item in the array, makes a request,
// When the request is recieved, the tradingPairsObject is updated to contain the current object
// And the new price. Then the object is returned
let array = [
  {
    pair: 'BTC-PERP',
    price: 10000,
  },
  {
    pair: 'ETH-PERP',
    price: 150,
  },
]

module.exports = {
  pairWatch: function (tradingPairsArray, tradingPairsObject) {
    console.log(tradingPairsArray)
    console.log('Watching pairs')

    // push object into array
    tradingPairsArray.push(tradingPairsObject)
    tradingPairsArray.map((pair) => {
      if (pair === '') {
        return console.log('empty pair')
      }
      console.log(pair)
      console.log('maping over pairs')
      setInterval(
        function () {
          ftx
            .request({
              method: 'GET',
              path: `/markets/${pair}`,
            })
            .then((res) => {
              let lastprice = res.result.last

              console.log(tradingPairsObject)
              // find pair in array
              // tradingPairsArray.find(pair)

              tradingPairsArray.find((item) => {
                item.price = lastprice
                return (item.pair = pair)
              })
              // update Array
            })
        },
        2000,
        pair,
        tradingPairsObject
      )
      return array.push(tradingPairsObject)
      // return console.log(tradingPairsObject)
    })
  },
}
