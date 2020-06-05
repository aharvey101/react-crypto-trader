import React, { Component } from 'react'
import axios from 'axios'

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      pair: 'BTC-PERP',
      entry: 10000,
      stop: 9000,
      positionSize: 0,
      portfolioSize: 1000,
      portolioRisk: 0.01,
      response: [],
    }

    this.updateOrder = this.updateOrder.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateBalances = this.updateBalances.bind(this)
  }

  updateBalances(e) {
    const { name, value } = e.target
    console.log(value)
    this.setState({
      [name]: value,
    })
    console.log(this.state.pair)
    axios
      .get('http://localhost:3001/getBalances')
      .then((res) => {
        let balance = res.data.balance
        this.setState({ ...this.state, portfolioSize: balance })
        console.log(this.state)
        // after balances are fetched, update the 'amount' in state to reflect the portfolio risk
        const tradeRisk = 1 - this.state.stop / this.state.entry

        // variables: portfolio size, trade risk, entry price, stop price, position size, trade amount, portolio risk
        let newTradeAmount =
          (this.state.portfolioSize * this.state.portolioRisk) / tradeRisk
        let newPositionSize = newTradeAmount / this.state.entry
        this.setState({
          ...this.state,
          positionSize: newPositionSize,
        })
      })
      .catch((err) => console.log(err))
  }
  updateOrder(e) {
    const { name, value } = e.target
    console.log(value)
    this.setState({
      [name]: value,
    })
    console.log(this.state.pair)
  }

  submitForm() {
    const order = {
      pair: this.state.pair,
      positionSize: this.state.positionSize,
      entry: this.state.entry,
      stop: this.state.stop,
    }
    console.log(order)

    axios
      .post('http://localhost:3001/position/', order)
      .then((res) => {
        console.log(res.data)
        this.setState({ response: res.data })
      })
      .catch((err) => console.log(err))
  }

  render() {
    return (
      <div className="App">
        <h1>Order Input</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            this.submitForm()
          }}
        >
          <label>
            Pair
            <input
              name="pair"
              placeholder="Pair"
              onChange={this.updateOrder}
            ></input>
          </label>
          {/* <label>
            Amount
            <input
              type="number"
              name="amount"
              min="0.0001"
              max="99999"
              placeholder="Amount"
              onChange={this.updateOrder}
            ></input>
          </label> */}
          <label>
            Entry
            <input
              type="number"
              name="entry"
              placeholder="Entry"
              onChange={this.updateOrder}
            ></input>
          </label>
          <label>
            Stop
            <input
              type="number"
              name="stop"
              placeholder="Stop"
              onChange={this.updateBalances}
            ></input>
          </label>
          <button>Submit</button>
          <textarea readOnly value={this.state.response}></textarea>
        </form>
      </div>
    )
  }
}

export default OrderInput
