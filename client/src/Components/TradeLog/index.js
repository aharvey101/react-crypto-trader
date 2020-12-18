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
      isLoading: true,
    }

    this.makeRows = this.makeRows.bind(this)
    this.isLoading = true
  }

  //refresh state on load
  componentDidMount() {
    // set route
    const route =
      process.env.NODE_ENV === 'production'
        ? '/getPositions'
        : local + 'getPositions'
    axios.get(route).then((response) => {
      this.setState({ positions: response.data, isLoading: false })
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
    if (this.state.isLoading === true) {
      return (
        <div className="loader loader--style1" title="0">
          <svg
            version="1.1"
            id="loader-1"
            xmlns="http://www.w3.org/2000/svg"
            // xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            width="40px"
            height="40px"
            viewBox="0 0 40 40"
            enableBackground="new 0 0 40 40"
            // xml:space="preserve"
          >
            <path
              opacity="0.2"
              fill="#000"
              d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
    s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
    c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
            />
            <path
              fill="#000"
              d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
    C22.32,8.481,24.301,9.057,26.013,10.047z"
            >
              <animateTransform
                attributeType="xml"
                attributeName="transform"
                type="rotate"
                from="0 20 20"
                to="360 20 20"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </path>
          </svg>
        </div>
      )
    }
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
