const databaseManager = require('./databaseManager')
const calculate = require('./calculate')
const Position = require('../Models/position')
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = require('./telegramBot')


const fills = {}


fills.fills = async (fill, positions) => {

  // Works
  setTimeout(async (fill, positions) => {
    // Get fill, get all positions from database, 

    // filter positions to match only the ones that match the pair of the fill and the stop order isn't filled
    const filteredPosition = positions.filter((pos) => pos.pair === fill.future && pos.stopOrder.filled === undefined)
    if (filteredPosition.length === 0) {
      console.log('No position match');
      return
    }
    const pos = filteredPosition[0]

    // check the entry order filled value, if not true, put the fill in the entryOrder
    if (pos.entryOrder.filled !== true) {
      if (pos.entryOrder.fill === undefined) {
        pos.entryOrder.fill = []
      }
      pos.entryOrder.fill.push(fill)
      console.log('entry order fill', pos.entryOrder.fill);
      const size = calculate.accumulateSize(pos.entryOrder.fill)

      // if the combination of the fills adds up to be equal to or greater than the entryOrder size value
      if (size >= pos.entryOrder.amount) {
        // change the entryOrder filled value to true
        pos.entryOrder.filled = true
        return pos
      }
    } else if (pos.stopOrder.filled !== true) {
      console.log('filling stoporder');
      if (pos.stopOrder.fill === undefined) {
        pos.stopOrder.fill = []
      }
      pos.stopOrder.fill.push(fill)
      // filling stop, maybe trigger the calculation here?
      // calculate the pnl

      const size = calculate.accumulateSize(pos.stopOrder.fill)
      // if the combination of the fills = the position size (ie: the stop order has been completely filled)
      if (size >= pos.stopOrder.amount) {
        pos.stopOrder.filled = true
        const pnl = calculate.calculatePnl(pos)
        filteredPosition[0].pnl = Number(pnl)
        console.log(pnl);
        return pos
      }
    } else {
      return
    }



  }, 5000, fill, positions)
}

module.exports = fills