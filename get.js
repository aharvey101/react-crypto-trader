const ftxrest = require('ftx-api-rest')
require('dotenv').config()
const positions = require('./positions')
const mongoose = require('mongoose')
const Position = require('./Models/position')
const { createPosition, Positions } = require('./scripts/databaseManager')
const ftx = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.PRODUCTION ? 'initial' : '',
})

const uri = process.env.DATABASEURI
mongoose
  .connect(process.env.MONGODB_URI || uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then((res) => {
    console.log('connected to remote DB')
    positions.forEach(position => {
      cp(position)
    })
  })
  .catch((err) => console.log(err))


const pair = 'ETC-PERP'
async function getFills() {

  const response = await ftx.request({
    method: 'GET',
    path: `/fills?market=${pair}`,
  })

  console.log(response);

}


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



