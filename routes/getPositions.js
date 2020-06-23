const router = require('express').Router()
const exchange = require('../scripts/exchange')

router.get('/', async (req, res) => {
  const positions = await exchange.getPositions()
  res.send(positions)
})

module.exports = router