require('dotenv').config()
// process.env.NTBA_FIX_319 = 1;
const ftxws = require('ftx-api-ws')
const databaseManager = require('./databaseManager')
const Position = require('../Models/position')
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = require('./telegramBot')

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
        // filling stop, maybe trigger the calculation here?
        // if the combination of the fills = the position size (ie: the stop order has been completely filled)
        // calculate the pnl
        function accumulateSize(object) {
          const reducer = (accumulator, currentValue) => accumulator + currentValue
          const data = object.fill.map(fill => fill.size).reduce(reducer)
          return data
        }
        const size = accumulateSize(filteredPosition[0].stopOrder)
        console.log(size);

        if (size >= filteredPosition[0].positionSize) {
          const pnl = calculatePnl(filteredPosition[0])
          filteredPosition[0].pnl = pnl
          console.log(pnl);
        }
      }
      function calculatePnl(position) {
        // gets size by maping over entry order fills and adding up the size
        function accumulateSize(object) {
          const reducer = (accumulator, currentValue) => accumulator + currentValue
          const data = object.fill.map(fill => fill.size).reduce(reducer)
          return data
        }

        // gets fee's adding up the entry 
        function accumulateFee(object) {
          const reducer = (accumulator, currentValue) => accumulator + currentValue
          const data = object.fill.map(fill => fill.fee).reduce(reducer)
          return data
        }

        function orderPriceAverage(object) {
          const data = object.fill.map(fill => fill.price)
          const average = data.reduce((p, c) => p + c, 0) / data.length;
          return average
        }

        const entryAmount = accumulateSize(position.entryOrder)
        const entryPrice = orderPriceAverage(position.entryOrder)
        const entryResult = entryAmount * entryPrice
        const entryOrderFee = accumulateFee(position.entryOrder)

        const stopAmount = entryAmount;
        const stopPrice = orderPriceAverage(position.stopOrder)
        const stopResult = stopAmount * stopPrice;
        const stopOrderFee = accumulateFee(position.stopOrder)



        const result = entryPrice > stopPrice ? ((entryResult - stopResult) * -1) - entryOrderFee - stopOrderFee : entryResult - stopResult - entryOrderFee - stopOrderFee
        return result.toFixed(2)

      }

      // Post position to 
      Position.findByIdAndUpdate(filteredPosition[0]._id, filteredPosition[0], (err, newPosition) => {
        if (err) console.log(err);
        console.log('updated position is', newPosition);
        bot.sendMessage(chatId, `Got fill for ${filteredPosition[0].pair}, the updated position is ${newPosition}`)
      })

    }, 5000)


  })
}

module.exports = go