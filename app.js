require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3001
const mongoose = require('mongoose')
const path = require('path')
const cors = require('cors')
//Middleware?
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Database Connect
const uri = process.env.DATABASEURI
mongoose
  .connect(process.env.MONGODB_URI || uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log('connected to remote DB')
  })
  .catch((err) => console.log(err))

//Routes
const getBalances = require('./routes/getBalances')
const position = require('./routes/enterPosition')
const exitPosition = require('./routes/exitPosition')

//Use Routes

app.use('/position', position)
app.use('/getBalances', getBalances)
app.use('/exitPosition', exitPosition)

// if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
  })
}

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)