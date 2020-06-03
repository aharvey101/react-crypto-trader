const router = require('express').Router()
const ftxrest = require('ftx-api-rest')
const axios = require('axios')

const ftxr = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
})

router.get('/', async (req, res) => {
  const b = (async () => {
    const ftxBalance = await ftxr.request({
      method: 'GET',
      path: '/account',
    })
    const hardwareWalletBalance = await axios
      .get(process.env.ethPlorerURI)
      .then((res) => {
        console.log(Number(res.data.tokens[3].balance).toPrecision())

        function enlargeBalance(hwb) {
          return Number(hwb)
        }
        const hwb = enlargeBalance(res.data.tokens[3].balance)
        console.log(hwb)
        return res.data.tokens[3].balance * 1000
      })
    console.log(hardwareWalletBalance)
    const total = ftxBalance.result.collateral
    return total
  })()
  let data = await b
  console.log(data)
  res.send({ balance: data })
})

module.exports = router
