import React, { Component } from 'react'
import axios from 'axios'
import AnyChart from 'anychart-react'
import anychart from 'anychart'
import './overview.css'
const local = 'http://localhost:3001'


class Overview extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.configureChart = this.configureChart.bind(this)
    this.makePortfolioData = this.makePortfolioData.bind(this)
  }

  componentDidMount() {
    // load state from backend
    const route = process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}/getPositions`
    axios.get(route)
      .then(response => {
        this.setState({ ...this.state, positions: response.data })
        console.log(this.state);
        this.makePortfolioData()
      })
    this.configureChart()
    console.log(this.state);
  }

  configureChart() {
    const stage = anychart.graphics.create()
    const chart1 = anychart.line([1, 2, 3])
    chart1.bounds(0, 0, '100%', '50%')
    const data = this.state.positions
    console.log(data);
    this.setState({ ...this.state, chart: { instance: stage, chart1: chart1 } })
    console.log(this.state);
  }

  makePortfolioData() {
    const portfolioSizeArray = this.state.positions.map(position => position.portfolioSize)
    this.setState({ ...this.state, portfolioSizeArray: portfolioSizeArray })
    console.log(this.state);
  }

  render() {
    return (
      <div className="box">
        <div className="box-item">
          <AnyChart
            type="line"
            data={this.state.portfolioSizeArray}
            title="Portfolio"
            // width={600}
            // height={400}
            className="chart 1"
          ></AnyChart>
        </div>

      </div>
    )
  }
}

export default Overview