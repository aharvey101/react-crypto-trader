const router = require('express').Router()
const exchange = require('../scripts/exchange')

router.get('/', async (req, res) => {
  res.send(exchange.getPairs())
})

module.exports = router