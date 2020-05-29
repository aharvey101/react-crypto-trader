import React, { Component } from "react"
import axios from "axios"

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      pair: "BTC-PERP",
      amount: 0.01,
      entry: 10000,
      stop: 9000,

      response: [],
    }

    this.updateOrder = this.updateOrder.bind(this)
    this.submitForm = this.submitForm.bind(this)
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
      amount: this.state.amount,
      entry: this.state.entry,
      stop: this.state.stop,
    }
    console.log(order)

    axios
      .post("http://localhost:3001/position/", order)
      .then((res) => {
        console.log(res.data)
        this.setState({ response: JSON.stringify(res.data) })
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
            Amount
            <input
              type="number"
              name="amount"
              min="0.0001"
              max="99999"
              placeholder="Amount"
              onChange={this.updateOrder}
            ></input>
          </label>
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
              onChange={this.updateOrder}
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
