const databaseManager = require('./databaseManager')
const calculate = require('./calculate')
const Position = require('../Models/position')
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = require('./telegramBot')


const fills = {}


fills.fills = (pos) => {
  // Works
  setTimeout(async () => {
    // Get fill, get all positions from database, 
    const positions = await databaseManager.getPositions()
    // filter positions to match only the ones that match the pair of the fill and the stop order isn't filled
    const filteredPosition = positions.filter((pos) => pos.pair === fill[0].future && pos.stopOrder.filled === undefined)
    if (filteredPosition.length === 0) {
      console.log('No position match');
      return
    }

    const pos = filteredPosition[0]

    // check the entry order filled value, if not true, put the fill in the entryOrder
    if (pos.entryOrder.filled !== true) {
      pos.entryOrder.fill.push(fill)
      const size = calculate.accumulateSize(pos.entryOrder.fill)
      // if the combination of the fills adds up to be equal to or greater than the entryOrder size value
      if (size >= pos.entryOrder.size) {
        // change the entryOrder filled value to true
        pos.entryOrder.filled = true
      }
    } else if (pos.stopOrder.filled !== true) {
      pos.stopOrder.fill.push(fill)
      // filling stop, maybe trigger the calculation here?
      // calculate the pnl

      const size = calculate.accumulateSize(pos.stopOrder)
      console.log(size);

      // if the combination of the fills = the position size (ie: the stop order has been completely filled)
      if (size >= pos.positionSize) {
        pos.stopOrder.filled = true
        const pnl = calculate.calculatePnl(pos)
        filteredPosition[0].pnl = pnl
        console.log(pnl);
      }
    } else {
      return
    }

    // Post position to 
    databaseManager.findByIdAndUpdate(pos)

  }, 5000, pos)
}

module.exports = fills