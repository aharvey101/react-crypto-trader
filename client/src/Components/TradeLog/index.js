import './tradeLog.css'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const local = 'http://localhost:3001/'


const Row = props => (
  <tr>
    <td className="table-body-item" >{props.position.pair}</td>
    {/* TODO: Fix the date; its gross */}
    <td className="table-body-item" >{date(props.position)}</td>
    <td className="table-body-item" >{strategy(props.position)}</td>
    <td className="table-body-item" >{direction(props.position)}</td>
    <td className="table-body-item" >{props.position.timeframe}</td>
    <td className="table-body-item" >${calculatePnl(props.position)}</td>
    <td className="table-body-item" >${risked(props.position)}</td>
    <td className="table-body-item" >{slippage(props.position)}%</td>
    <td className="table-body-item" ><Link exact='true' to={{ pathname: `/position/${props.position._id}`, state: props.position }}><button>View</button></Link></td>

  </tr>
)



function date(position) {
  const date = new Date(position.date)
  return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
}

function strategy(position) {
  return position.strategy ? position.strategy : 'cradle'
}

function direction(position) {
  return position.entry > position.stop ? 'long' : 'short'
}

function calculatePnl(position) {

  function accumulateSize(object) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue
    const data = object.fill.map(fill => fill.size).reduce(reducer)
    return data
  }
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

function slippage(position) {
  const isShort = position.entry > position.stop ? false : true
  function orderPriceAverage(object) {
    // console.log(objecst);
    const data = object.fill.map(fill => fill.price)
    const average = data.reduce((p, c) => p + c, 0) / data.length;
    return average
  }
  const desiredEntry = position.entry
  const actualEntry = orderPriceAverage(position.entryOrder)

  const slippage = !isShort ? (actualEntry - desiredEntry) / desiredEntry * 100 : ((actualEntry - desiredEntry) / desiredEntry * 100) * -1;

  return slippage.toFixed(2)

}

function risked(position) {
  const tradeRisk = 1 - position.stop / position.entry
  return tradeRisk.toFixed(2)
}

export default class TradeLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      positions: [{
        entryOrder: {
          fill: [{}]
        },
        stopOrder: {
          fill: [{ fee: 1 }, { fee: 2 }]
        }
      }]
    }

    this.makeRows = this.makeRows.bind(this)
  }

  //refresh state on load

  componentDidMount() {
    // set Router
    //process.env.NODE_ENV === 'production' ? '/getPositions' : 
    const route = 'http://localhost:3001/getpositions'
    axios.get('http://localhost:3001/getPositions')
      .then(response => {
        this.setState({ positions: response.data })
        this.makeRows()
      })

  }

  makeRows() {
    return this.state.positions.map(position => {
      return <Row position={position} key={position._id} />
    })
  }

  render() {


    return (
      <div className="table-wrapper">
        <table className="table">
          <caption className="table-caption">The current positions</caption>
          <thead className="table-head">
            <tr>
              <th className='table-head-item'>Pair</th>
              <th className='table-head-item'>Date</th>
              <th className='table-head-item'>Strategy</th>
              <th className='table-head-item'>Direction</th>
              <th className='table-head-item'>Timeframe</th>
              <th className='table-head-item'>PnL</th>
              <th className='table-head-item'>$ Risked</th>
              <th className='table-head-item'>Entry Slippage</th>
              <th className='table-head-item'>ViewPositon</th>
            </tr>
          </thead>
          <tbody>
            {this.makeRows()}
          </tbody>
        </table>
      </div>
    )
  }
}