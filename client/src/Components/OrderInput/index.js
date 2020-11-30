import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './orderInput.css'
const local = 'http://localhost:3001/'

const OrderInput = () => {
  const [state, setState] = useState({
    pair: 'BTC-PERP',
    strategy: 'cradle',
    timefame: 0,
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
    pairs: [{ name: 'BTC-PERP', id: 1 }],
  })

  //Get Pairs from FTX
  useEffect(() => {
    // Update pairs in state
    // set Route
    const pairsRoute =
      process.env.NODE_ENV === 'production' ? '/getPairs' : `${local}getPairs`
    // get pairs
    axios
      .get(pairsRoute)
      .then((response) => {
        //filter out non essential data
        let pairs = response.data.map((pair, index) => {
          return { name: pair.name, id: index }
        })
        //update state with response
        setState((prevState) => ({ ...prevState, pairs }))
      })
      // getBalances
      .then(() => {
        getBalances()
      })
      .catch((error) => console.log(error))
  }, [])
  const getBalances = () => {
    // Update Balance in state
    // set route
    const balancesRoute =
      process.env.NODE_ENV === 'production'
        ? '/getBalances'
        : `${local}getBalances`
    // get balances
    axios.get(balancesRoute).then((response) => {
      setState((prevState) => ({
        ...prevState,
        portfolioSize: response.data.balance,
      }))
    })
  }

  // HandleChange
  const handleChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({ ...prevState, [name]: value }))
  }

  // Update Position Size
  const updatePosSize = () => {
    const tradeRisk = 1 - state.stop / state.entry
    let newTradeAmount = (state.portfolioSize * state.portfolioRisk) / tradeRisk
    let newPositionSize = newTradeAmount / state.entry
    newPositionSize.toFixed(6)

    setState((prevState) => ({
      ...prevState,
      positionSize:
        // if positionSize is negative, make it positive
        newPositionSize < 0 ? newPositionSize * -1 : newPositionSize,
      risked: risked(state),
    }))
  }

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault()
    const order = {
      pair: state.pair,
      positionSize: state.positionSize,
      entry: state.entry,
      stop: state.stop,
      strategy: state.strategy,
      risked: state.risked,
      timeframe: state.timeframe,
      portfolioSize: state.portfolioSize,
      portfolioRisk: state.portfolioRisk,
      tf1: state.tf1,
      tf2: state.tf2,
      tf3: state.tf3,
      isShort: state.entry > state.stop ? false : true,
      adminCode: state.adminCode,
    }
    const route =
      process.env.NODE_ENV === 'production' ? '/position' : `${local}position`
    axios
      .post(route, order)
      .then((res) => {
        console.log(res.data)
        setState((prevState) => ({ ...prevState, response: res.data }))
      })
      .catch((err) => console.log(err))
  }

  const risked = (state) => {
    const isShort = state.entry > state.stop ? false : true
    const risked = isShort
      ? state.portfolioSize * state.portfolioRisk * -1
      : state.portfolioSize * state.portfolioRisk
    return Number(risked)
  }

  const pairs = state.pairs.map((item) => {
    return (
      <option key={item.id} value={item.name}>
        {item.name}
      </option>
    )
  })
  return (
    <div className="order-component">
      <h1 className="order-component-form-title">Order Input</h1>
      <form onSubmit={handleSubmit} className="order-input-form">
        <label className="input-label">Pair</label>
        <select
          name="pair"
          placeholder="Pair"
          className="input-field"
          onChange={handleChange}
        >
          {pairs ? pairs : ''}
        </select>
        <label className="input-label">Timeframe</label>
        <select
          name="timeframe"
          placeholder="Timeframe"
          className="input-field"
          onChange={handleChange}
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
        <label className="input-label">Strategy</label>
        <select name="strategy" placeholder="cradle" onChange={handleChange}>
          <option value="cradle">Cradle</option>
          <option value="fib-booster">Fib Booster</option>
          <option value="breakout">Breakout</option>
        </select>
        <label className="input-label">Risk</label>
        <select
          name="portfolioRisk"
          placeholder="0.01"
          step="0.001"
          className="input-field"
          onChange={(e) => {
            handleChange(e)
            updatePosSize()
          }}
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
          onChange={(e) => {
            handleChange(e)
            updatePosSize()
          }}
          required
        ></input>
        <label className="input-label">Stop</label>
        <input
          type="number"
          name="stop"
          step="0.000001"
          placeholder="Stop"
          className="input-field"
          onChange={(e) => {
            handleChange(e)
            updatePosSize()
          }}
          required
        ></input>
        <label className="input-label">Entry Timeframe</label>
        <input
          type="text"
          name="tf1"
          placeholder="Entry Timeframe"
          className="input-field"
          onChange={handleChange}
        ></input>
        <label className="input-label">Second Timeframe</label>
        <input
          type="text"
          name="tf2"
          placeholder="Second Timeframe"
          className="input-field"
          onChange={handleChange}
        ></input>
        <label className="input-label">Third Timeframe</label>
        <input
          type="text"
          name="tf3"
          placeholder="Third Timeframe"
          className="input-field"
          onChange={handleChange}
        ></input>
        <label className="input-label">Admin Code</label>
        <input
          type="password"
          name="adminCode"
          placeholder="Admin Code"
          className="input-field"
          onChange={handleChange}
        ></input>
        <button className="submit-button">Submit</button>
        <label className="input-label">Order:</label>
        <p>Pair: {state.pair}</p>
        {/* fix to display selected timeframe, not state */}
        <p>
          Timeframe:{' '}
          {state.timeframe / 60 >= 60
            ? state.timeframe / 60 / 60 + `hr`
            : state.timeframe / 60 + `m`}
        </p>
        <p>Entry: {state.entry}</p>
        <p>Stop: {state.stop}</p>
        <p>Position Size: {state.positionSize}</p>
        <p>Portfolio Size: {state.portfolioSize}</p>
        <label className="input-label">Response From Server</label>
        <textarea
          className="text-field"
          readOnly
          rows="5"
          value={state.response}
        ></textarea>
      </form>
    </div>
  )
}

export default OrderInput
