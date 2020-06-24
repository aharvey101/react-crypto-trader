const exchange = require('./exchange')
const dbManager = require('./databaseManager')
const mongoose = require('mongoose')
const Position = require('../Models/position')
const ftxrest = require('ftx-api-rest')
const { db } = require('../Models/position')
require('dotenv').config()

const ftx = new ftxrest({
  key: 'MbP9BIT7jjUPdSeWowAWln6T_LDrNe4nn3WKlDEL',
  secret: 'NnYmeMzW2VO3ttsFwmFH0DA38XkV8luRN6LPPUm_',
})


const order = {
  pair: 'THETA-PERP'
}

async function getPositionInfo() {

  ftx.request({
    method: 'POST',
    path: '/orders',
    data: {
      market: 'THETA-PERP',
      side: 'buy',
      price: '0.26',
      type: 'market',
      size: '1'
    }
  }).then((response) => {
    console.log(response);
  })

  const returnFromPromise = async function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        return resolve(getPos());
      }, 1)
    })
  }
  async function getPos() {
    const response = await ftx.request({
      method: 'GET',
      path: '/positions',
      data: {
        showAvgPrice: true,
      },
    })
    return response
  }

  const response = await getPos()

  // console.log(response);
  const newRes = await response.result.filter((position) => {
    if (position.size !== 0 && position.future === order.pair) {
      console.log(position);
      return true
    } else {
      return false
    }
  })
  console.log(newRes);
}

getPositionInfo()
// const dooo = async () => {


//   const uri = 'mongodb+srv://mylinuxbook:uaEWxX50KcdXI9mj@cluster0-p4bfn.mongodb.net/development?retryWrites=true&w=majority'
//   mongoose
//     .connect(process.env.MONGODB_URI || uri, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//       useFindAndModify: false,
//     })
//     .then((res) => {
//       console.log('connected to remote DB')
//     })
//     .catch((err) => console.log(err))

//   const newPosition = {
//     pair: 'BTC-PERP',
//     positionSize: 1,
//     entry: 10000,
//     stop: 9000,
//     timeframe: '1h',
//     date: new Date(),
//     entryOrderId: 123,
//     averageFillPrice: 10001,
//   }
//   Position.create(newPosition, function (
//     err,
//     newlyCreated
//   ) {
//     if (err) {
//       console.log(err)
//     } else {
//       console.log(
//         `the newly created position is: ${JSON.stringify(newlyCreated)}`
//       )
//     }
//   })
//   // find all positions in db

//   async function promise() {
//     const dbResponse = await Position.findOne(newPosition, (err, res) => {
//       if (err) {
//         console.log(err);
//       } else {
//         return res
//       }
//     })
//     return dbResponse
//   }
//   const response = await promise()
//   console.log(response);


//   // Currently doesn't work
//   // console.log('response before returning in createPosition is',);

//   // filter by date
//   // return
// }
// dooo()
