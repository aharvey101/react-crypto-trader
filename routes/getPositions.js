const router = require('express').Router()
const databaseManager = require('../scripts/databaseManager')

router.get('/', async (req, res) => {
  const positions = await databaseManager.getPositions()
  // console.log('getting positions');
  console.log('getting positions');
  res.send(positions)
})

router.post('/:id/edit', async (req, res) => {

})

module.exports = router

