import React, { Component } from 'react'
import axios from 'axios'
const backendURL = process.env.backendURL || 'http://localhost:3001/'

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      pair: '',
      entry: 0,
      stop: 0,
      positionSize: 0,
      portfolioSize: 10000,
      portolioRisk: 0.01,
      response: [],
    }

    this.updatePair = this.updatePair.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateBalances = this.updateBalances.bind(this)
  }

  updateBalances(e) {
    const { name, value } = e.target
    this.setState({
      [name]: parseInt(value),
    })
    const route = 'getBalances'
    axios
      .get(`${backendURL}${route}`)
      .then((res) => {
        let balance = res.data.balance
        this.setState({ ...this.state, portfolioSize: balance })
        console.log(this.state)
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
      })
      .catch((err) => console.log(err))
    console.log(this.state)
  }
  updatePair(e) {
    const { name, value } = e.target
    this.setState({
      [name]: `${value}-perp`,
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
    const route = 'position'
    axios
      .post(`${backendURL}${route}`, order)
      .then((res) => {
        console.log(res.data)
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

          <label className="input-label">Entry</label>

          <input
            type="number"
            name="entry"
            placeholder="Entry"
            className="input-field"
            onChange={this.updateBalances}
          ></input>

          <label className="input-label">Stop</label>

          <input
            type="number"
            name="stop"
            placeholder="Stop"
            className="input-field"
            onChange={this.updateBalances}
          ></input>

          <button className="submit-button">Submit</button>
          <textarea
            className="text-field"
            readOnly
            rows="5"
            value={this.state.response}
          ></textarea>
        </form>
      </div>
    )
  }
}

export default OrderInput
