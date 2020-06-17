import React, { Component } from 'react'
import axios from 'axios'
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
      portolioRisk: 0.001,
      response: [],
    }

    this.updatePair = this.updatePair.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateBalances = this.updateBalances.bind(this)
    this.exitPosition = this.exitPosition.bind(this)
  }

  updateBalances(e) {
    const { name, value } = e.target
    this.setState({
      [name]: parseFloat(value),
    })
    const route =
      process.env.NODE_ENV === 'production'
        ? '/getBalances'
        : `${local}/getbalances`
    axios
      .get(route)
      .then((res) => {
        let balance = res.data.balance
        this.setState({ ...this.state, portfolioSize: balance })
        // after balances are fetched, update the 'positionSize'
        const tradeRisk = 1 - this.state.stop / this.state.entry
        let newTradeAmount =
          (this.state.portfolioSize * this.state.portolioRisk) / tradeRisk
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
    console.log(this.state)
  }
  updatePair(e) {
    const { name, value } = e.target

    this.setState({
      [name]: `${value}`.toUpperCase(),
    })
    console.log(this.state)
  }

  submitForm() {
    const order = {
      pair: this.state.pair,
      positionSize: this.state.positionSize,
      entry: this.state.entry,
      stop: this.state.stop,
    }
    console.log(order)
    const route =
      process.env.NODE_ENV === 'production' ? '/position' : `${local}/position`
    axios
      .post(route, order)
      .then((res) => {
        console.log(res.data)
        this.setState({ response: res.data })
      })
      .catch((err) => console.log(err))
  }

  exitPosition(e) {
    e.preventDefault()

    const order = this.state

    const route =
      process.env.NODE_ENV === 'production'
        ? '/exitPosition'
        : `${local}/exitPosition`
    axios
      .post(route, order)
      .then((res) => {
        console.log(res)
        this.setState({ response: res.data })
      })
      .catch((err) => console.log(err))
  }

  render() {
    return (
      <div className="order-component">
        <h1>Order Input</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            this.submitForm()
          }}
          className="orderInputForm"
        >
          <label className="input-label">
            Pair - no need to add -perp, it automatically adds it
          </label>
          <input
            name="pair"
            placeholder="Pair"
            className="input-field"
            onChange={this.updatePair}
          ></input>
          <label className="input-label">Timeframe</label>
          <input
            name="timeframe"
            placeholder="Timeframe"
            className="input-field"
            onChange={this.updatePair}
          ></input>
          <label className="input-label">Risk</label>
          <input
            name="portfolioRisk"
            placeholder="0.01"
            className="input-field"
            onChange={this.updateBalances}
          ></input>
          <label className="input-label">Entry</label>
          <input
            type="number"
            name="entry"
            step="0.000001"
            placeholder="Entry"
            className="input-field"
            onChange={this.updateBalances}
          ></input>
          <label className="input-label">Stop</label>
          <input
            type="number"
            name="stop"
            step="0.000001"
            placeholder="Stop"
            className="input-field"
            onChange={this.updateBalances}
          ></input>
          <button className="submit-button">Submit</button>
          <label>Order:</label>
          <p>Pair: {this.state.pair}</p>
          <p>Timeframe: {this.state.timeframe}</p>
          <p>Entry: {this.state.entry}</p>
          <p>Stop: {this.state.stop}</p>
          <p>Posision Size: {this.state.positionSize}</p>
          <p>Portfolio Size: {this.state.portfolioSize}</p>
          <label>Response From Server</label>
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
