import React, { Component } from 'react'
import axios from 'axios'

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

    this.updateOrder = this.updateOrder.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.updateBalances = this.updateBalances.bind(this)
  }

  updateBalances(e) {
    const { name, value } = e.target
    this.setState({
      [name]: parseInt(value),
    })
    axios
      .get('http://localhost:3001/getBalances')
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
  updateOrder(e) {
    const { name, value, type } = e.target
    // if (name === 'entry') {
    //   return (value = parseInt(value))
    // }
    this.setState({
      [name]: type === 'number' ? parseInt(value, 10) : value,
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
          <label>
            Entry
            <input
              type="number"
              name="entry"
              placeholder="Entry"
              // value={this.state.entry}
              onChange={this.updateOrder}
            ></input>
          </label>
          <label>
            Stop
            <input
              type="number"
              name="stop"
              placeholder="Stop"
              // value={this.state.stop}
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
