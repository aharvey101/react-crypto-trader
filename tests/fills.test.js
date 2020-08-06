const fills = require('../scripts/fills')
// const jest = require('jest')

const pos = [{
  pair: "ETH-PERP",
  positionSize: 0.022,
  entry: 1000,
  stop: 900,
  strategy: "cradle",
  entryOrder: {
    symbol: "ETH - PERP",
    type: "stop",
    side: "sell",
    price: 1000,
    amount: 1,
    fill: [{
      future: "ETH-PERP",
      price: 1000,
      fee: 0.0,
      size: 1
    }],
    filled: true,
  },
  "position": [],
  stopOrder: {
    price: 900,
    amount: 1,
    status: "open",
    fill: [{
      future: "ETH-PERP",
      price: 900,
      fee: 0.0,
      size: 0.5
    }],
  },
}]


const fill = {
  future: "ETH-PERP",
  fee: 0.0,
  price: 900,
  size: 0.5
}

// jest.useFakeTimers()

test('expect a fill object will fill attached to it', async () => {
  const gotfill = await fills.fills(fill, pos)
  console.log('gotFill is', gotfill);
  expect(gotfill)
})
