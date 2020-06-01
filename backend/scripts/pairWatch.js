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

module.exports = {
  pairWatch: async function (tradingPairsArray) {
    console.log(
      `When tradingPairs Array is ingested ${JSON.stringify(tradingPairsArray)}`
    )
    console.log('Watching pairs')

    //Seems that getting specific data for each pair and updating it isn't a great idea.
    // I will now try to get a list of all the data from the server and filter it by the tradingPairsArray
    let d = []
    let goOn = true
    const func = await getData(goOn)
    async function wait(goOn) {
      while ((goOn = true)) {}
    }
    async function getData() {
      await ftx
        .request({
          method: 'GET',
          path: '/markets',
        })
        .then((res) => {
          d = sort(res, tradingPairsArray)
          function sort(res, tpa) {
            //map over trading Pairs Array, filter server results by each item in trading Pairs Array
            return tpa.map((pair) => {
              return res.result.filter((i) => i.name === pair.pair)
            })
          }
        })
    }
    return d
  },
}
