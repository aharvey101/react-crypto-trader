

const calculate = {}

calculate.accumulateSize = (object) => {

  const reducer = (accumulator, currentValue) => accumulator + currentValue
  const data = object.map(fill => fill.size).reduce(reducer, 0)
  return data

}


calculate.calculatePnl = (position) => {

  // gets size by maping over entry order fills and adding up the size
  function accumulateSize(object) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const data = object.fill.map(fill => fill.size).reduce(reducer)
    return data
  }

  // gets fee's adding up the fill fees
  function accumulateFee(object) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const data = object.fill.map(fill => fill.fee).reduce(reducer)
    return data
  }

  function orderPriceAverage(object) {
    const data = object.fill.map(fill => fill.price)
    const average = data.reduce((p, c) => p + c, 0) / data.length;
    return average
  }

  const entryAmount = accumulateSize(position.entryOrder)
  const entryPrice = orderPriceAverage(position.entryOrder)
  const entryResult = entryAmount * entryPrice
  const entryOrderFee = accumulateFee(position.entryOrder)

  const stopAmount = entryAmount;
  const stopPrice = orderPriceAverage(position.stopOrder)
  const stopResult = stopAmount * stopPrice;
  const stopOrderFee = accumulateFee(position.stopOrder)



  const result = entryPrice > stopPrice ? ((entryResult - stopResult) * -1) - entryOrderFee - stopOrderFee : entryResult - stopResult - entryOrderFee - stopOrderFee
  return result.toFixed(2)


}

module.exports = calculate