const router = require('express').Router()
const databaseManager = require('../scripts/databaseManager')
const Position = require('../Models/position')

router.get('/', async (req, res) => {
  const positions = await databaseManager.getPositions()
  // console.log('getting positions');
  console.log('getting positions');
  res.send(positions)
})

router.put('/', async (req, res) => {
  console.log('posting');
  // create position from post request, find in database and update
  const position = req.body
  const newPosition = await Position.findByIdAndUpdate(req.body._id, position, { new: true }, (err, position) => {
    if (err) {
      res.send('Error', err.message)
    }
    else {
      console.log('position updated');
    }
  })

})

router.delete('/', async (req, res) => {
  // delete position from db
  console.log('deleting');
  const position = req.body
  Position.findByIdAndDelete(position._id)
    .then(() => {

      res.send('position Updated')
    })
})

module.exports = router

