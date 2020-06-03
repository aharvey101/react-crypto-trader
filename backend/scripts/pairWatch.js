const ftxrest = require('ftx-api-rest')
// const ast = require('util')
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

module.exports = {
  pairWatch: async function (tradingPairsArray) {
    console.log(
      `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
    )
    console.log('Watching pairs')
    let d = []

    // const setAsyncSetInterval = require('util').promisify(setTimeout)
    const setAsyncSetInterval = (cb, timeout = 500) => {
      return new Promise((resolve) => {
        setInterval(() => {
          cb()
          resolve()
        }, timeout)
      })
    }
    const getData = async (d) => {
      await setAsyncSetInterval(
        null,
        () => {
          ftx
            .request({
              method: 'GET',
              path: '/markets',
            })
            .then((res) => {
              d = sort(res, tradingPairsArray)
              console.log(d)
              function sort(res, tpa) {
                //map over trading Pairs Array, filter server results by each item in trading Pairs Array
                return tpa.map((pair) => {
                  return res.result.filter((i) => i.name === pair.pair)
                })
              }
              return d
            })
        },
        500,
        d
      )
    }
    getData(d)
    console.log(d)
    return d
  },

  // two alternate options:
  //idea 1:
  // have a variable set to a boolean value
  // have a setInterval run that turns the boolean to true or false
  // have another loop that while the boolean value is true, runs the function
  // idea 2:
  // global variable taht sets delay measured in ms
  //
  //
  //inside of a while lo
}
