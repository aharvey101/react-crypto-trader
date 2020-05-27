require("dotenv").config()
const express = require("express")
const app = express()
const port = 3001
const cors = require("cors")
//Middleware?
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

//Routes
const position = require("./routes/position")

app.get("/", (req, res) => res.send("Hello World!"))

//Use Routes
app.use("/position", position)

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
)
