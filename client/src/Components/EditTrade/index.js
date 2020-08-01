import React, { Component } from 'react'
import axios from 'axios'
import './editTrade.css'
const local = 'http://localhost:3001/'

class EditTrade extends Component {
  constructor(props) {
    super(props)
    this.state = props.location.state
    this.updatePair = this.updatePair.bind(this)
    this.submitForm = this.submitForm.bind(this)
    console.log(this.state);

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
    const position = this.state
    console.log(position)
    const route =
      process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}getPositions`
    axios
      .put(route, position)
      .then((res) => {
        console.log(res.data)
        this.setState({ ...this.state, response: res.data })
      })
      .catch((err) => console.log(err))
    window.location = '/tradelog'
  }

  render() {

    return (
      <div className="order-component">
        <h1 className="order-component-form-title">Edit Trade</h1>
        <h3 className="order-component-form-title">Entry Order</h3>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            this.submitForm()
          }}
          className="order-input-form"
        >
          <label className="input-label">Pair</label>
          <input
            name="pair"
            defaultValue={this.state.pair}
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Timeframe</label>
          <select
            name="timeframe"
            placeholder="Timeframe"
            className="input-field"
            onChange={this.updatePair}
            defaultValue={this.state.timeframe}
          >
            <option value="60">1m</option>
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
          <label className="input-label">Risk</label>
          <input
            name="portfolioRisk"
            defaultValue="0.01"
            step="0.001"
            className="input-field"
            // onChange={this.updateBalances}
            type="number"
          >

          </input>
          <label className="input-label">Entry</label>
          <input
            type="number"
            name="entry"
            step="0.000001"
            defaultValue={this.state.entry}
            className="input-field"
            // onChange={this.updateBalances}
            required
          ></input>
          <label className="input-label">Stop</label>
          <input
            type="number"
            name="stop"
            step="0.000001"
            defaultValue={this.state.stop}
            className="input-field"
            // onChange={this.updateBalances}
            required
          ></input>
          <label className="input-label">Entry Timeframe</label>
          <input
            type="text"
            name="tf1"
            defaultValue={this.state.tf1}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Second Timeframe</label>
          <input
            type="text"
            name="tf2"
            defaultValue={this.state.tf2}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Third Timeframe</label>
          <input
            type="text"
            name="tf3"
            defaultValue={this.state.tf3}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <h3 className="order-component-form-title">Entry Fill</h3>
          <label className="input-label">fee</label>
          <input
            name="fee"
            defaultValue={this.state.entryOrder.fill[0].fee}
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <button className="submit-button">Submit</button>
        </form>
      </div>
    )
  }
}

export default EditTrade
