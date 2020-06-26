const ftxrest = require('ftx-api-rest')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

module.exports = {
  pairWatch: async function (draftPosition) {
    let pair = draftPosition.pair
    // function that gets price
    async function getPrices() {
      const response = await new Promise((resolve, reject) => {
        resolve(
          ftx.request({
            method: 'GET',
            path: '/markets/' + pair,
          })
        )
      })
      return response.result.last
    }

    const gotPrices = await getPrices()
    return gotPrices
  },
}
