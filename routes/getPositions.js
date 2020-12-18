const router = require('express').Router()
const databaseManager = require('../scripts/databaseManager')
const Position = require('../Models/position')

router.get('/', async (req, res) => {
  const positions = await databaseManager.getPositions()
  // console.log('getting positions');
  console.log('getting positions')
  res.send(positions)
})

router.put('/', async (req, res) => {
  console.log('posting')
  //check if admin Code was supplied
  if (req.body.adminCode === process.env.ADMINCODE) {
    // create position from post request, find in database and update
    const position = req.body
    const newPosition = await Position.findByIdAndUpdate(
      req.body._id,
      position,
      { new: true },
      (err, position) => {
        if (err) {
          res.send('Error', err.message)
        } else {
          console.log('position updated')
          res.send('position Updated')
        }
      }
    )
  } else {
    // res.send(res.status(500).json({
    //   status: 'error',
    //   messa
    res.send(new Error('there was an error'))
    throw new Error('Admin code was wrong')
  }
})

router.delete('/', async (req, res) => {
  // delete position from db
  console.log('deleting')
  const position = req.body
  Position.findByIdAndDelete(position._id).then(() => {
    res.send('position Updated')
  })
})

module.exports = router
