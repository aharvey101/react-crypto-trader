const express = require('express')
const router = express.Router()
const ccxtExchange = require('../scripts/ccxtExchange')

router.post('/', async (req, res) => {

  //Get order info
  const order = req.body
  console.log(order);
  // ccxtExchange.entry(order)

  res.send('recieved order' + JSON.stringify(order))
})

module.exports = router