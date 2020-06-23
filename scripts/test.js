const exchange = require('./exchange')
const dbManager = require('./databaseManager')
const mongoose = require('mongoose')
const Position = require('../Models/position')
const { db } = require('../Models/position')
require('dotenv').config()


const dooo = async () => {


  const uri = 'mongodb+srv://mylinuxbook:uaEWxX50KcdXI9mj@cluster0-p4bfn.mongodb.net/development?retryWrites=true&w=majority'
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

  const newPosition = {
    pair: 'BTC-PERP',
    positionSize: 1,
    entry: 10000,
    stop: 9000,
    timeframe: '1h',
    date: new Date(),
    entryOrderId: 123,
    averageFillPrice: 10001,
  }
  Position.create(newPosition, function (
    err,
    newlyCreated
  ) {
    if (err) {
      console.log(err)
    } else {
      console.log(
        `the newly created position is: ${JSON.stringify(newlyCreated)}`
      )
    }
  })
  // find all positions in db

  async function promise() {
    const dbResponse = await Position.findOne(newPosition, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        return res
      }
    })
    return dbResponse
  }
  const response = await promise()
  console.log(response);


  // Currently doesn't work
  // console.log('response before returning in createPosition is',);

  // filter by date
  // return
}
dooo()
