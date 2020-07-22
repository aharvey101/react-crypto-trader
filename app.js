require('dotenv').config()
const express = require('express')
const app = express()
const sslRedirect = require('heroku-ssl-redirect')
const port = process.env.PORT || 3001
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
const concurrentPositons = require('./scripts/concurrentPositions')
const websocket = require('./scripts/webSocket')
//Middleware?
app.use(sslRedirect())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

//Database Connect
const uri = process.env.DATABASEURI
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

//Routes
const getBalances = require('./routes/getBalances')
const position = require('./routes/enterPosition')
const exitPosition = require('./routes/exitPosition')
const getPairs = require('./routes/getPairs')
const getPositions = require('./routes/getPositions')
const getCurrerntPositions = require('./routes/getCurrentPositions')
const webhook = require('./routes/webhook')

//Use Routes

app.use('/position', position)
app.use('/getBalances', getBalances)
app.use('/exitPosition', exitPosition)
app.use('/getPairs', getPairs)
app.use('/getPositions', getPositions)
app.use('/getCurrentPositions', getCurrerntPositions)
app.use('/webhook', webhook)

// if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

// start existing positions
// concurrentPositons.start()

// Start websocket
websocket()


app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
