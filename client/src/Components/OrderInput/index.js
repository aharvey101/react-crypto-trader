import React, { Component } from 'react'
import axios from 'axios'
import './orderInput.css'
const local = 'http://localhost:3001/'

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      pair: '',
      entry: 0,
      stop: 0,
      positionSize: 0,
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
        console.log(this.state);
      })
      .catch(error => console.log(error))
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

        this.setState({
          ...this.state,
          positionSize:
            // if positionSize is negative, make it positive
            newPositionSize < 0 ? newPositionSize * -1 : newPositionSize,
        })
        console.log(this.state)
      })
      .catch((err) => console.log(err))
    const { name, value } = e.target
    this.setState({
      [name]: parseFloat(value),
    })
    console.log(this.state)
  }
  updatePair(e) {
    e.preventDefault()
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
    console.log(this.state)
  }

  submitForm() {
    const order = {
      pair: this.state.pair,
      positionSize: this.state.positionSize,
      entry: this.state.entry,
      stop: this.state.stop,
      timeframe: this.state.timeframe,
      orderDate: this.state.orderDate,
      tf1: this.state.tf1,
      tf2: this.state.tf2,
      tf3: this.state.tf3,
    }
    console.log(order)
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
            <option value="60">1m</option>
            <option value="300">5m</option>
            <option value="600">10m</option>
            <option value="900">15m</option>
            <option value="1800">30m</option>
            <option value="3600">1h</option>
            <option value="7200">2h</option>
            <option value="14400">4h</option>
            <option value="28800">8h</option>
            <option value="43200">12h</option>
            <option value="57600">16h</option>
            <option value="86400">1d</option>
            <option value="172800">2d</option>
          </select>
          <label className="input-label">Risk</label>
          <input
            name="portfolioRisk"
            placeholder="0.01"
            step="0.001"
            className="input-field"
            onChange={this.updateBalances}
            type="number"
          >

          </input>
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
          <p>Timeframe: {document.getElementsByName('timeframe').values}</p>
          <p>Entry: {this.state.entry}</p>
          <p>Stop: {this.state.stop}</p>
          <p>Posision Size: {this.state.positionSize}</p>
          <p>Portfolio Size: {this.state.portfolioSize}</p>
          <label className="input-label" >Response From Server</label>
          <textarea
            className="text-field"
            readOnly
            rows="5"
            value={this.state.response}
          ></textarea>
          <button className="exit-position" onClick={this.exitPosition}>
            Exit Position
          </button>
        </form>
      </div>
    )
  }
}

export default OrderInput
