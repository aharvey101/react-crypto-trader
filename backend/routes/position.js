const express = require("express")
const router = express.Router()
const position = require("../scripts/position")

router.post("/", (req, res) => {
  console.log("they be posting orders")
  const order = req.body
  console.log(typeof position.placeOrder)
  // position.placeOrder(order)
  position.pairWatch(order)
  res.send("I placed the order")
})

module.exports = router
