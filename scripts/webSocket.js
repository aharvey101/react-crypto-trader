require('dotenv').config()
process.env.NTBA_FIX_319 = 1;
const ftxws = require('ftx-api-ws')
const fills = require('./fills')
const databaseManager = require('./databaseManager')
const bot = require('./telegramBot')
const chatId = process.env.TELEGRAM_CHAT_ID

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
    databaseManager.getPositions()
      .then(positions => {
        console.log(positions);
        fills.fills(fill, positions)
          .then(result => {
            if (result === false) {
              console.log('result was false');
            }
            databaseManager.findByIdAndUpdate(result)
          })
      })
    bot.sendMessage(chatId, `got fill for ${fill.pair} at ${fill.price} side was ${fill.side}`)
  })
}

module.exports = go