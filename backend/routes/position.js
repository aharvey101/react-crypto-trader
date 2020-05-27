const express = require("express")
const router = express.Router()
// const position = require("../scripts/position")

const ftxrest = require("ftx-api-rest")

const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})
let response

function placeOrder(order) {
  const { pair, amount, entry } = order
  ftx
    .request({
      method: "POST",
      path: "/orders",
      data: {
        market: pair,
        type: "limit",
        side: "buy",
        price: entry,
        size: amount,
      },
    })
    .then((res) => {
      response = res
      console.log(response)
    })
}

router.post("/", (req, res) => {
  console.log("they be posting orders")
  const order = req.body
  placeOrder(order)
  res.send(response)
})

module.exports = router
