import './tradeLog.css'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
const local = 'http://localhost:3001/'

const Row = (props) => (
  <tr>
    <td className="table-body-item">{props.position.pair}</td>

    <td className="table-body-item">{date(props.position)}</td>
    <td className="table-body-item">
      {props.position.strategy ? props.position.strategy : 'cradle'}
    </td>
    <td className="table-body-item">
      {props.position.isShort === 'true' ? 'short' : 'long'}
    </td>
    <td className="table-body-item">
      {props.position.timeframe / 60 >= 60
        ? props.position.timeframe / 60 / 60 + `hr`
        : props.position.timeframe / 60 + `m`}
    </td>
    <td className="table-body-item">
      <Link
        exact="true"
        to={{
          pathname: `/position/${props.position._id}`,
          state: props.position,
        }}
      >
        <button>View</button>
      </Link>
    </td>
  </tr>
)

function date(position) {
  const date = new Date(position.date)
  return date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear()
}

function slippage(position) {
  const isShort = position.entry > position.stop ? false : true
  function orderPriceAverage(object) {
    const data = object.fill.map((fill) => fill.price)
    const average = data.reduce((p, c) => p + c, 0) / data.length
    return average
  }
  const desiredEntry = position.entry
  const actualEntry = orderPriceAverage(position.entryOrder)

  const slippage = isShort
    ? ((actualEntry - desiredEntry) / desiredEntry) * 100 * -1
    : ((actualEntry - desiredEntry) / desiredEntry) * 1000

  return slippage.toFixed(2)
}

function risked(position) {
  const isShort = position.entry > position.stop ? false : true
  const tradeRisk = isShort
    ? (position.entry * position.positionSize -
        position.stop * position.positionSize) *
      -1
    : position.entry * position.positionSize -
      position.stop * position.positionSize
  return tradeRisk.toFixed(2)
}

export default class TradeLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      positions: [
        {
          entryOrder: {
            fill: [{}],
          },
          stopOrder: {
            fill: [{ fee: 1 }, { fee: 2 }],
          },
        },
      ],
    }

    this.makeRows = this.makeRows.bind(this)
  }

  //refresh state on load

  componentDidMount() {
    // set Router
    //process.env.NODE_ENV === 'production' ? '/getPositions' :
    const route =
      process.env.NODE_ENV === 'production'
        ? '/getPositions'
        : local + 'getPositions'
    axios.get(route).then((response) => {
      this.setState({ positions: response.data })
      this.makeRows()
    })
  }

  makeRows() {
    return this.state.positions
      .map((position) => {
        // console.log(position)
        return <Row position={position} key={position._id} />
      })
      .reverse()
  }

  render() {
    return (
      <div className="table-wrapper">
        <table className="table">
          <caption className="table-caption">Trade Log</caption>
          <thead className="table-head">
            <tr>
              <th className="table-head-item">Pair</th>
              <th className="table-head-item">Date</th>
              <th className="table-head-item">Strategy</th>
              <th className="table-head-item">Direction</th>
              <th className="table-head-item">Timeframe</th>
              <th className="table-head-item">ViewPositon</th>
            </tr>
          </thead>
          <tbody>{this.makeRows()}</tbody>
        </table>
      </div>
    )
  }
}
