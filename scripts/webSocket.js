require('dotenv').config()
const ftxws = require('ftx-api-ws')
const databaseManager = require('./databaseManager')
const Position = require('../Models/position')


const ws = new ftxws({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subbaccount: process.env.PRODUCTION ? 'initial' : ''
})

const go = async () => {
  await ws.connect()

  ws.subscribe('fills')
  ws.on('fills', async (res) => {
    const response = res
    // Make array of the fills because there may be more than one fill
    const fill = [response]
    console.log(fill);

    // Get fill, get all positions from database, 
    // filter positions to match only the ones that match the pair of the fill and have no stoporder fill
    // check the entryOrder fill, if undefined, put the fill in the entryOrder
    // if not undefined, put the fill in the stopOrder

    // Works
    setTimeout(async () => {
      const positions = await databaseManager.getPositions()
      const filteredPosition = positions.filter((pos) => pos.pair === fill[0].future && pos.stopOrder.fill === undefined)
      if (filteredPosition.length === 0) {
        console.log('No position match');
        return
      }

      if (filteredPosition[0].entryOrder.fill === undefined) {
        filteredPosition[0].entryOrder.fill = fill
      } else {
        filteredPosition[0].stopOrder.fill = fill
      }
      console.log('after mutation', filteredPosition);

      // Post position to 
      Position.findByIdAndUpdate(filteredPosition[0]._id, filteredPosition[0], (err, newPosition) => {
        if (err) console.log(err);
        console.log('updated position is', newPosition);
      })

    }, 5000)


  })
}

module.exports = go