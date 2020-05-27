const ftxrest = require("ftx-api-rest")

const ftx = new ftxrest({
  apiKey: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

function placeOrder(order) {
  const { pair, amount, entry } = order
  let response
  ftx
    .request({
      method: "POST",
      path: "/ORDERS",
      data: {
        market: pair,
        type: "market",
        side: "buy",
        price: entry,
        size: amount,
      },
    })
    .then((res) => {
      response = res
      console.log(response)
      return response
    })
  return response
}

module.export = placeOrder
