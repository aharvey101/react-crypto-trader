const express = require("express")
const router = express.Router()
const ftxrest = require("ftx-api-rest")

const ftx = new ftxrest({
  key: "1",
  secret: "1",
})

router.get("/", (req, res) => {
  ftx
    .request({
      method: "GET",
      path: "/markets",
    })
    .then((market) => {
      res.send(market)
    })
    .catch((err) => console.log(err))
  console.log("got market data and sent")
})

router.post("/", (req, res) => {
  console.log("they be posting orders")
  const { pair, amount, entry, stop } = req.body
  console.log(pair, amount, entry, stop)
  console.log(req.body)
  res.send(JSON.stringify(req.body))
})

module.exports = router
