const calculate = require('../scripts/calculate')

const position = {
  positionSize: 1,
  entryOrder: {
    fill: [
      {
        size: 0.5,
        fee: 0.1,
        price: 10,
      },
      {
        size: 0.5,
        fee: 0.2,
        price: 9
      }
    ]
  },
  stopOrder: {
    size: 1,
    fill: [
      {
        fee: 0.1,
        price: 5,
      },
      {
        fee: 0.1,
        price: 4.9
      }
    ]
  }
}

test('should return a number', () => {
  const number = calculate.calculatePnl(position)
  expect(number)
})

// function testCalc(position) {
//   const response = calculate.calculatePnl(position)
//   console.log(response);
// }

// testCalc(position)