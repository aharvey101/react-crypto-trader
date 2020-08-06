import React, { Component } from 'react'
import axios from 'axios'
import './orderInput.css'
const local = 'http://localhost:3001/'

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      pair: 'BTC-PERP',
      strategy: 'cradle',
      timefame: 60,
      entry: 0,
      stop: 0,
      positionSize: 0,
      risked: 0,
      portfolioSize: 10000,
      portfolioRisk: 0.01,
      orderDate: '',
      tf1: '',
      tf2: '',
      tf3: '',
      response: [],
      pairs: [{ name: 'BTC-PERP', id: 1 }
      ],
    }

    this.updatePair = this.updatePair.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateBalances = this.updateBalances.bind(this)
    this.exitPosition = this.exitPosition.bind(this)
    this.risked = this.risked.bind(this)

  }

  componentDidMount() {
    // Update pairs in state
    // set Route
    const route =
      process.env.NODE_ENV === 'production'
        ? '/getPairs'
        : `${local}getPairs`

    // get pairs
    axios.get(route)
      .then(response => {
        //filter out non essential data
        let pairs = response.data.map((pair, index) => {
          return { name: pair.name, id: index }
        })
        //update state with response
        this.setState({ ...this.state, pairs: pairs })
      })
      .catch(error => console.log(error))
  }


  risked(state) {
    const isShort = state.entry > state.stop ? false : true
    const risked = isShort ? this.state.portfolioSize * this.state.portfolioRisk * -1 : this.state.portfolioSize * this.state.portfolioRisk
    return Number(risked)
  }

  updateBalances(e) {

    const route =
      process.env.NODE_ENV === 'production'
        ? '/getBalances'
        : `${local}getbalances`
    axios
      .get(route)
      .then((res) => {
        let balance = res.data.balance
        this.setState({ ...this.state, portfolioSize: balance })
        // after balances are fetched, update the 'positionSize'
        const tradeRisk = 1 - this.state.stop / this.state.entry
        let newTradeAmount =
          (this.state.portfolioSize * this.state.portfolioRisk) / tradeRisk
        let newPositionSize = newTradeAmount / this.state.entry
        newPositionSize.toFixed(6)

        this.setState({
          ...this.state,
          positionSize:
            // if positionSize is negative, make it positive
            newPositionSize < 0 ? newPositionSize * -1 : newPositionSize,
          risked: this.risked(this.state)
        })
        console.log(this.state);
      })
      .catch((err) => console.log(err))
    const { name, value } = e.target
    this.setState({
      [name]: parseFloat(value),
    })

  }
  updatePair(e) {
    e.preventDefault()
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
  }

  submitForm() {
    const order = {
      pair: this.state.pair,
      positionSize: this.state.positionSize,
      entry: this.state.entry,
      stop: this.state.stop,
      strategy: this.state.strategy,
      risked: this.state.risked,
      timeframe: this.state.timeframe,
      portfolioSize: this.state.portfolioSize,
      tf1: this.state.tf1,
      tf2: this.state.tf2,
      tf3: this.state.tf3,
      isShort: this.state.entry > this.state.stop ? false : true
    }
    console.log('state before submission', order);
    const route =
      process.env.NODE_ENV === 'production' ? '/position' : `${local}position`
    axios
      .post(route, order)
      .then((res) => {
        console.log(res.data)
        this.setState({ ...this.state, response: res.data })
      })
      .catch((err) => console.log(err))
  }

  exitPosition(e) {
    e.preventDefault()

    const order = this.state

    const route =
      process.env.NODE_ENV === 'production'
        ? '/exitPosition'
        : `${local}exitPosition`
    axios
      .post(route, order)
      .then((res) => {
        console.log(res)
        this.setState({ response: res.data })
      })
      .catch((err) => console.log(err))
  }

  render() {
    const pairs = this.state.pairs.map((item) => {
      return <option key={item.id} value={item.name}>
        {item.name}</option>
    })
    return (
      <div className="order-component">
        <h1 className="order-component-form-title">Order Input</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            this.submitForm()
          }}
          className="order-input-form"
        >
          <label className="input-label">Pair</label>
          <select
            name="pair"
            placeholder="Pair"
            className="input-field"
            onChange={this.updatePair}
          >
            {pairs}
          </select>
          <label className="input-label">Timeframe</label>
          <select
            name="timeframe"
            placeholder="Timeframe"
            className="input-field"
            onChange={this.updatePair}

          >
            <option value="60"  >1m</option>
            <option value="300">5m</option>
            <option value="600">10m</option>
            <option value="900">15m</option>
            <option value="1800">30m</option>
            <option value="3600">1h</option>
            <option value="7200">2h</option>
            <option value="10800">3h</option>
            <option value="14400">4h</option>
            <option value="21600">6h</option>
            <option value="28800">8h</option>
            <option value="43200">12h</option>
            <option value="57600">16h</option>
            <option value="86400">1d</option>
            <option value="172800">2d</option>
          </select>
          <label className="input-label">Strategy</label>
          <select name="strategy" placeholder="cradle" onChange={this.updatePair}>
            <option value="cradle" >Cradle</option>
            <option value="fib-booster" >Fib Booster</option>
            <option value="breakout" >Breakout</option>
          </select>
          <label className="input-label">Risk</label>
          <select
            name="portfolioRisk"
            placeholder="0.01"
            step="0.001"
            className="input-field"
            onChange={this.updateBalances}
            type="number"
          >
            <option value="0.01">1%</option>
            <option value="0.005">0.5%</option>
            <option value="0.003333">0.33%</option>
            <option value="0.0025">0.25%</option>
            <option value="0.02">2%</option>
          </select>
          <label className="input-label">Entry</label>
          <input
            type="number"
            name="entry"
            step="0.000001"
            placeholder="Entry"
            className="input-field"
            onChange={this.updateBalances}
            required
          ></input>
          <label className="input-label">Stop</label>
          <input
            type="number"
            name="stop"
            step="0.000001"
            placeholder="Stop"
            className="input-field"
            onChange={this.updateBalances}
            required
          ></input>
          <label className="input-label">Entry Timeframe</label>
          <input
            type="text"
            name="tf1"
            placeholder="Entry Timeframe"
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Second Timeframe</label>
          <input
            type="text"
            name="tf2"
            placeholder="Second Timeframe"
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Third Timeframe</label>
          <input
            type="text"
            name="tf3"
            placeholder="Third Timeframe"
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <button className="submit-button">Submit</button>
          <label className="input-label">Order:</label>
          <p>Pair: {this.state.pair}</p>
          {/* fix to display selected timeframe, not state */}
          <p>Timeframe: {(this.state.timeframe / 60) >= 60 ? this.state.timeframe / 60 / 60 + `hr` : this.state.timeframe / 60 + `m`}</p>
          <p>Entry: {this.state.entry}</p>
          <p>Stop: {this.state.stop}</p>
          <p>Position Size: {this.state.positionSize}</p>
          <p>Portfolio Size: {this.state.portfolioSize}</p>
          <label className="input-label" >Response From Server</label>
          <textarea
            className="text-field"
            readOnly
            rows="5"
            value={this.state.response}
          ></textarea>
        </form>
      </div >
    )
  }
}

export default OrderInput
