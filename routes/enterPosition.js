const managePosition = require('../scripts/managePosition')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  const order = req.body
  managePosition.inputNewPosition(order)

  res.send('recieved order' + JSON.stringify(order))
})

module.exports = router
