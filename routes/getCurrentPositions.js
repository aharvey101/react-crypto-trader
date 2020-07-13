const router = require('express').Router()
const exchange = require('../scripts/exchange')

router.get('/', async (req, res) => {
  const positions = await exchange.getPositions()
  // console.log('getting positions');
  console.log('getting positions');
  res.send(positions)
})

module.exports = router