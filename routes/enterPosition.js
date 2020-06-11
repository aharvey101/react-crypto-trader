const mp = require('../scripts/managePosition')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  console.log('they be posting orders')
  const order = req.body
  mp(order)

  res.send('recieved order' + JSON.stringify(order))
})

module.exports = router
