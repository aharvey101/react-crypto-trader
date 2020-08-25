const databaseManager = require('./databaseManager')
const calculate = require('./calculate')
const Position = require('../Models/position')
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = require('./telegramBot')


const fills = {}


fills.fills = async (fill, positions) => {

  async function wait() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(processFills(fill, positions))
      }, 5000, fill, positions)
    })
  }
  // Works
  function processFills(fill, positions) {


    // Get fill, get all positions from database, 

    // filter positions to match only the ones that match the pair of the fill and the stop order isn't filled
    const filteredPosition = positions.filter((pos) => pos.pair === fill.future && pos.stopOrder.filled === undefined)
    if (filteredPosition.length === 0) {
      console.log('No position match');
      return false
    }
    const pos = filteredPosition[0]

    // if position isShort = true and fill.side = sell, place fill in entryOrder.fill
    // || isShort = false and fill.side = buy, place fill in entryOrder.fill
    // else if isShort = false and fill.side = sell, place fill in stopOrder.fill
    // || if isShort = "true" and fill.side = buy, place fill in StopOrder.fill

    if (pos.isShort === "true" && fill.side === "sell" || pos.isShort === "false" && fill.side === "buy") {
      if (pos.entryOrder.fill === undefined) {
        pos.entryOrder.fill = []
      }
      console.log('filling entryOrder');
      pos.entryOrder.fill.push(fill)
      console.log('entry order fill is', pos.entryOrder.fill);
      const size = calculate.accumulateSize(pos.entryOrder.fill)

      // if the combination of the fills adds up to be equal to or greater than the entryOrder size value
      if (size >= pos.entryOrder.amount) {
        // change the entryOrder filled value to true
        pos.entryOrder.filled = true
        return pos
      }
      return pos
    } else if (pos.isShort === "true" && fill.side === "buy" || pos.isShort === "false" && fill.side === "sell") {
      console.log('filling Stop Order');
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
        bot.sendMessage(chatId, `pnl for ${pos.pair} is ${pnl}`)
        console.log(pnl);
        return pos
      }
      return pos
    } else {
      return
    }
  }
  const response = await wait()

  return response
}

module.exports = fills