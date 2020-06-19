const router = require('express').Router()
const exchange = require('../scripts/exchange')

router.get('/', async (req, res) => {
  const pairs = await exchange.getPairs()
  res.send(pairs)
})

module.exports = router