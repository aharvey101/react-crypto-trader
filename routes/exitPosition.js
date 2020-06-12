const router = require('express').Router()
const managePosition = require('../scripts/managePosition')

router.post('/', async (req, res) => {
  const order = req.body
  const response = await managePosition
    .exitPositon(order)
    .then((res) => {
      if (res.success) {
        return console.log('Successfully exited position', res)
      }
      throw new Error('there was an error')
    })
    .catch((err) => console.log('There was an error', err))
  res.send(response)
})

module.exports = router
