require('dotenv').config()
const ftxws = require('ftx-api-ws')
const databaseManager = require('./scripts/databaseManager')
const mongoose = require('mongoose')
const Position = require('./Models/position')
const { exitPositon } = require('./scripts/managePosition')

// CONNECT TO DB
const uri = process.env.DATABASEURI
mongoose
  .connect(process.env.MONGODB_URI || uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log('connected to remote DB')
  })
  .catch((err) => console.log(err))


const ws = new ftxws({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

const go = async () => {
  await ws.connect()

  ws.subscribe('fills')
  ws.on('fills', async (res) => {
    console.log(res);

    const fill = res
    // get all positions from database
    const positions = await databaseManager.getPositions()
    //filter positions by fill pair

    // Get fill, get all positions from database, filter positions to match only the ones that match the pair of the fill
    // check the stopOrder fill, if undefined, check the entryOrder fill, if undefined, put the fill in the entryOrder
    // if not undefined, put the fill in the stopOrder fill
    // TODO: Filter Positions is broken again!?
    setTimeout(() => {
      const filteredPosition = positions.filter((pos) => pos.pair === fill.future && pos.stopOrder.fill === undefined || !pos.stopOrder.fill)

      console.log('filtered position before mutation', filteredPosition);

      if (!filteredPosition[0].entryOrder.fill) {
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

    }, 6000)


  })
}

go()