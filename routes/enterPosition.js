const managePosition = require('../scripts/managePosition')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  //check if admin code was supplied
  if(req.body.adminCode === process.env.ADMINCODE){
    const order = req.body
    managePosition.inputNewPosition(order)
    res.send('recieved order' + JSON.stringify(order))
  } else {
    res.send('admin code was not supplied correctly')
  }

})

module.exports = router
