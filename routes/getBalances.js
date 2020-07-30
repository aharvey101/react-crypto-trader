const router = require('express').Router()
const ftxrest = require('ftx-api-rest')
const axios = require('axios')

const ftxr = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.PRODUCTION ? 'initial' : ''
})

router.get('/', async (req, res) => {
  const account = 'Main Account'
  const b = (async () => {
    const ftxBalance = await ftxr.request({
      method: 'GET',
      path: '/account',
    })
    const hardwareWalletBalance = await axios
      .get(process.env.ethPlorerURI)
      .then((res) => {
        //TODO:
        // Currently this works, but it would be better to map over the tokens array instead of referencing a specific element
        const hwb = res.data.tokens[3].balance / 1000000000000000000
        return hwb
      })
    const total = ftxBalance.result.collateral
    return total
  })()
  let data = await b
  res.send({ balance: data })
})

module.exports = router
