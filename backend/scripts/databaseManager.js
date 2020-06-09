const Position = require('../Models/position')

function newPositionToDB(order) {
  //create position
  const ncp = {
    pair: order.pair,
    amount: order.amount,
    entry: order.entry,
    stop: order.stop,
    timeframe: order.timeframe,
  }
  Position.create(ncp, function (err, newlyCreated) {
    if (err) {
      console.log(err)
    } else {
      //redirect back to campgrounds page
      console.log(newlyCreated)
    }
  })
}

module.exports = newPositionToDB
