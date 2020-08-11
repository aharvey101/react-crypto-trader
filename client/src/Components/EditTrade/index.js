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
    this.calculatePnl = this.calculatePnl.bind(this)
    this.deletePosition = this.deletePosition.bind(this)
    this.updateEntry = this.updateEntry.bind(this)
  }
  updatePair(e) {
    e.preventDefault()
    const { name, value } = e.target
    this.setState({
      [name]: value,
    })
    console.log(this.state);
  }

  updateEntry(e) {
    e.preventDefault()
    const { name, value } = e.target
    const entry = this.state.entryOrder.fill
    this.setState({
      entryOrder: { ...this.state.entryOrder, fill: [...this.state.entryOrder.fill, { [name]: value }] },
    })
  }


  deletePosition(e) {
    e.preventDefault()
    const route =
      process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}getPositions`
    console.log('deleting position');
    axios.delete(route, { data: this.state })
    window.location = '/tradelog'
  }

  calculatePnl(e) {
    e.preventDefault()

    // gets size by maping over entry order fills and adding up the size
    function accumulateSize(object) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const data = object.fill.map(fill => fill.size).reduce(reducer)
      return data
    }

    // gets fee's adding up the fill fees
    function accumulateFee(object) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const data = object.fill.map(fill => fill.fee).reduce(reducer)
      return data
    }

    function orderPriceAverage(object) {
      const data = object.fill.map(fill => fill.price)
      const average = data.reduce((p, c) => p + c, 0) / data.length;
      return average
    }
    const entryAmount = accumulateSize(this.state.entryOrder)
    const entryPrice = orderPriceAverage(this.state.entryOrder)
    const entryResult = entryAmount * entryPrice
    const entryOrderFee = accumulateFee(this.state.entryOrder)
    const stopAmount = entryAmount;
    const stopPrice = orderPriceAverage(this.state.stopOrder)
    const stopResult = stopAmount * stopPrice;
    const stopOrderFee = accumulateFee(this.state.stopOrder)
    const result = entryPrice > stopPrice ? ((entryResult - stopResult) * -1) - entryOrderFee - stopOrderFee : entryResult - stopResult - entryOrderFee - stopOrderFee
    this.setState({ ...this.state, pnl: result.toFixed(2) })

  }

  submitForm() {
    const position = this.state
    console.log(position)
    const route =
      process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}getPositions`
    axios
      .put(route, position)
      .catch((err) => console.log(err))
    setTimeout(() => {
      window.location = '/tradelog'
    }, 500)
  }

  render() {
    return (
      <div className="order-component">
        <h1 className="order-component-form-title">Edit Trade</h1>
        <button className="submit-button" onClick={this.deletePosition}>Delete</button>
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
            value={this.state.pair}
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
            value={this.state.timeframe}
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
          <select
            name="portfolioRisk"
            placeholder="0.01"
            step="0.001"
            className="input-field"
            onChange={this.updateBalances}
            type="number"
          >
            <option value="0.001">0.1%</option>
            <option value="0.01">1%</option>
            <option value="0.005">0.5%</option>
            <option value="0.003333">0.33%</option>
            <option value="0.0025">0.25%</option>
            <option value="0.02">2%</option>
          </select>
          <label className="input-label">Portfolio Size</label>
          <input
            name="portfolioSize"
            step="0.001"
            className="input-field"
            onChange={this.updatePair}
            type="number"
            value={this.state.portfolioSize}
          >
          </input>
          <label className="input-label">Strategy</label>
          <select name="strategy" placeholder="cradle" onChange={this.updatePair}>
            <option value="cradle" >Cradle</option>
            <option value="fib-booster" >Fib Booster</option>
            <option value="breakout" >Breakout</option>
          </select>
          <label className="input-label">Entry</label>
          <input
            type="number"
            name="entry"
            step="0.000001"
            value={this.state.entry}
            className="input-field"
            onChange={this.updatePair}
            required
          ></input>
          <label className="input-label">Stop</label>
          <input
            type="number"
            name="stop"
            step="0.000001"
            value={this.state.stop}
            className="input-field"
            onChange={this.updatePair}
            required
          ></input>
          <label className="input-label">Entry Timeframe</label>
          <input
            type="text"
            name="tf1"
            value={this.state.tf1}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Second Timeframe</label>
          <input
            type="text"
            name="tf2"
            value={this.state.tf2}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <label className="input-label">Third Timeframe</label>
          <input
            type="text"
            name="tf3"
            value={this.state.tf3}
            className="input-field"
            onChange={this.updatePair}>
          </input>
          <h3 className="order-component-form-title">Entry Order</h3>
          <label className="input-label">Entry Order Size</label>
          <input
            name="entryOrder:{size:"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <h3 className="order-component-form-title">Fill 1</h3>
          <label className="input-label">price</label>
          <input
            name="price"
            className="input-field"
            onChange={this.updateEntry}
          >
          </input>
          <label className="input-label">Fee</label>
          <input
            name="entryOrder.fill[0].fee"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Size</label>
          <input
            name="entryOrder.fill[0].size"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <h3 className="order-component-form-title">Fill 2</h3>
          <label className="input-label">price</label>
          <input
            name="entryOrder.fill[1].price"

            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Fee</label>
          <input
            name="entryOrder.fill[1].fee"

            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Size</label>
          <input
            name="entryOrder.fill[1].size"

            className="input-field"
            onChange={this.updatePair}
          >
          </input>

          <h3 className="order-component-form-title">Stop Order</h3>
          <label className="input-label">Stop Order Size</label>
          <input
            name="stopOrder.size"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <h3 className="order-component-form-title">Fill 1</h3>
          <label className="input-label">Fee</label>
          <input
            name="stopOrder.fill[0].fee"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Size</label>
          <input
            name="stopOrder.fill[0].size"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">price</label>
          <input
            name="stopOrder.fill[0].price"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <h3 className="order-component-form-title">Fill 2</h3>
          <label className="input-label">Fee</label>
          <input
            name="stopOrder.fill[1].fee"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Size</label>
          <input
            name="stopOrder.fill[1].size"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">price</label>
          <input
            name="stopOrder.fill[1].price"
            className="input-field"
            onChange={this.updatePair}
          >
          </input>
          <label className="input-label">Pnl</label>
          <input
            name="pnl"
            value={this.state.pnl || ''}
            className="input-field"
            onChange={this.updatePair}
            type="number"
            step="0.01"
          >
          </input>
          <button onClick={this.calculatePnl}>Calculate PnL</button>
          <button className="submit-button">Submit</button>
        </form>
      </div>
    )
  }
}

export default EditTrade
