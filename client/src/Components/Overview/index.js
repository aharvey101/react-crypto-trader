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
  }

  componentDidMount() {
    // load state from backend
    const route = process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}/getPositions`
    axios.get(route)
      .then(response => {
        this.setState({ positions: response.data })
        console.log(this.state);
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

  render() {
    return (
      <div className="box">
        <AnyChart
          // instance={this.state.chart.instance}
          width={600}
          height={400}
        // charts={this.state.chart.chart1}
        ></AnyChart>
      </div>
    )
  }
}

export default Overview