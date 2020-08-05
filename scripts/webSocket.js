require('dotenv').config()
// process.env.NTBA_FIX_319 = 1;
const ftxws = require('ftx-api-ws')
const fills = require('./fills')
const Position = require('../Models/position')

const ws = new ftxws({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.NODE_ENV === 'production' ? 'initial' : "testaccount"
})

const go = async () => {
  await ws.connect()
  ws.subscribe('fills')
  ws.on('fills', async (res) => {
    const response = res
    // Make array of the fills because there may be more than one fill
    const fill = [response]
    fills.fills(fill)

  })
}

module.exports = go