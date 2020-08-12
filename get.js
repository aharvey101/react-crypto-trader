const ftxrest = require('ftx-api-rest')
require('dotenv').config()
// const positions = require('./positions')
const mongoose = require('mongoose')
const Position = require('./Models/position')
// const { createPosition, Positions } = require('./scripts/databaseManager')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: 'initial',
})

// const uri = process.env.DATABASEURI
// mongoose
//   .connect(process.env.MONGODB_URI || uri, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//   })
//   .then((res) => {
//     console.log('connected to remote DB')
//     positions.forEach(position => {
//       cp(position)
//     })
//   })
//   .catch((err) => console.log(err))


const pair = 'MKR-PERP'
async function getFills(pair) {

  const response = await ftx.request({
    method: 'GET',
    path: `/fills?market=${pair}`,
  })

  console.log(response);

}

getFills(pair)

async function getOrders() {


  const response = await ftx.request({
    method: 'GET',
    path: `/conditional_orders/history?market=${pair}`,
  })

  console.log(response);

}


async function getPostions() {

  const response = await ftx.request({
    method: 'GET',
    path: `/positions`
  })
  console.log(response);
}



