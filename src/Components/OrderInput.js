import React, { Component } from "react"
import axios from "axios"

class OrderInput extends Component {
  constructor() {
    super()
    this.state = {
      order: {
        pair: "BTC-PERP",
        amount: 0.01,
        entry: 10000,
        stop: 9000,
      },
      response: [],
    }

    this.updateOrder = this.updateOrder.bind(this)
    this.submitForm = this.submitForm.bind(this)
  }

  updateOrder(e) {
    const name = e.target.name
    const value =
      e.target.type === "number" ? parseFloat(e.target.value) : e.target.value
    this.setState({
      ...this.state,
      [name]: value.type === "number" ? parseInt(value) : value,
    })
    console.log(this.state)
  }

  submitForm() {
    const order = {
      pair: this.state.order.pair,
      amount: this.state.order.amount,
      entry: this.state.order.entry,
      stop: this.state.order.stop,
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
              name="Pair"
              placeholder="Pair"
              onChange={this.updateOrder}
            ></input>
          </label>
          <label>
            Amount
            <input
              type="number"
              name="Amount"
              placeholder="Amount"
              onChange={this.updateOrder}
            ></input>
          </label>
          <label>
            Entry
            <input
              type="number"
              name="Entry"
              placeholder="Entry"
              onChange={this.updateOrder}
            ></input>
          </label>
          <label>
            Stop
            <input
              type="number"
              name="Stop"
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
