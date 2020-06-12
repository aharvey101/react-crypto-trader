const managePosition = require('../scripts/managePosition')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  console.log('they be posting orders')
  const order = req.body
  managePosition.inputNewPosition(order)

  res.send('recieved order' + JSON.stringify(order))
})

module.exports = router
