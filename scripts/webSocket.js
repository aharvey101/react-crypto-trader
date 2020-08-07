require('dotenv').config()
process.env.NTBA_FIX_319 = 1;
const ftxws = require('ftx-api-ws')
const fills = require('./fills')
const databaseManager = require('./databaseManager')

const ws = new ftxws({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.NODE_ENV === 'production' ? 'initial' : "testaccount"
})

const go = async () => {
  await ws.connect()
  ws.subscribe('fills')
  ws.on('fills', async (res) => {

    // Make array of the fills because there may be more than one fill
    const fill = res
    console.log('got fill from exchange', fill);
    const positions = await databaseManager.getPositions()
    console.log('positions are', positions);
    fills.fills(fill, positions)
      .then(result => {
        if (result) {
          console.log(result);
          databaseManager.findByIdAndUpdate(result)
        }
      })
  })
}

module.exports = go