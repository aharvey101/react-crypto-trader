import React, { Component } from 'react'
import axios from 'axios'
import AnyChart from 'anychart-react'
import anychart from 'anychart'
import './overview.css'
import { trades, pairs } from './data'
const local = 'http://localhost:3001'

// The chart doesn't truly reflect the trades in the log because i have messed with the equity
anychart.theme = 'lightBlue'

const Row = (props) => (
  <tr>
    <td className="table-body-item">{props.position.pair}</td>
    <td className="table-body-item">
      {props.position.trend === 1 ? 'up' : 'down'}
    </td>
  </tr>
)

class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.configureChart = this.configureChart.bind(this)
    // this.makePortfolioData = this.makePortfolioData.bind(this)
    this.makeRows = this.makeRows.bind(this)
  }

  componentDidMount() {
    // load state from backend
    // const route =
    //   process.env.NODE_ENV === 'production'
    //     ? '/getPositions'
    //     : `${local}/getPositions`
    // axios.get(route).then((response) => {
    //   this.setState({ ...this.state, positions: response.data })

    //   this.makePortfolioData()
    // })
    this.configureChart()
    this.setState((prevState) => {
      return { ...prevState, portfolioSizeArray: trades }
    })
  }

  configureChart() {
    const stage = anychart.graphics.create()
    const chart1 = anychart.line([1, 2, 3])
    chart1.bounds(0, 0, '100%', '50%')

    this.setState({ ...this.state, chart: { instance: stage, chart1: chart1 } })
  }

  // makePortfolioData() {
  //   const portfolioSizeArray = this.state.positions.map(
  //     (position) => position.portfolioSize
  //   )
  //   // const tradetype = this.state.positions.map(position => position.type)
  //   this.setState({ ...this.state, portfolioSizeArray: portfolioSizeArray })
  // }.

  makeRows() {
    return pairs.map((position) => {
      return <Row position={position} key={position.id} />
    })
  }

  render() {
    return (
      <div className="box">
        <div className="box-item">
          <AnyChart
            type="line"
            data={this.state.portfolioSizeArray}
            title="Portfolio"
            height={300}
            className="chart1"
            theme="lightBlue"
          ></AnyChart>
        </div>
        <div className="box-item">
          <table className="table">
            <thead className="">
              <tr>
                <th className="">Pair</th>
                <th className="">Trend</th>
              </tr>
            </thead>
            <tbody>{this.makeRows()}</tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default Overview
