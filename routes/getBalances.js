const router = require('express').Router()
const ftxrest = require('ftx-api-rest')
const axios = require('axios')

const ftxr = new ftxrest({
  key: process.env.API_KEY,
  secret: process.env.API_SECRET,
  subaccount: process.env.NODE_ENV === 'production' ? 'initial' : 'testaccount'
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
        const dai = res.data.tokens.filter(token => token.tokenInfo.symbol === 'DAI')
       
        
        const hwb = (dai[0].balance / 1000000000000000000)
        return hwb
      })
    const total = process.env.NODE_ENV === "production" ? ftxBalance.result.collateral + hardwareWalletBalance : ftxBalance.result.collateral
    return total
  })()
  let data = await b
  res.send({ balance: data })
})

module.exports = router
