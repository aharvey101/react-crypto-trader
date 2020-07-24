import React, { Component } from 'react'
import axios from 'axios'

import './tableOfPositions.css'
const local = 'http://localhost:3001'


const Row = props => (
  <tr>
    <td className="table-body-item" >{props.position.future}</td>
    <td className="table-body-item" >{props.position.entryPrice}</td>
    <td className="table-body-item" >{props.position.side}</td>
    <td className="table-body-item" >{props.position.size}</td>
    <td className="table-body-item" >{props.position.realizedPnl}</td>
    <td className="table-body-item" ><button >View</button></td>

  </tr>
)


export default class TableOfPositions extends Component {
  constructor() {
    super()
    this.state = {
      positions: [
        {
          future: 'btc-perp',
          entryPrice: 10000,
          side: 'buy',
          size: 1,
          unrealizedPnl: 100,
        }
      ],
    }

    this.getPositions = this.getPositions.bind(this)
    this.makeRows = this.makeRows.bind(this)
  }

  componentDidMount() {
    this.getPositions()
    this.makeRows()
  }

  getPositions() {
    // ask backend to get positions and asign to state
    const route = process.env.NODE_ENV === 'production' ? '/getCurrentPositions' : `${local}/getCurrentPositions`
    axios.get(route)
      .then(response => {
        console.log(response);
        this.setState({ positions: response.data })
        console.log(this.state);
      })

  }
  makeRows() {
    return this.state.positions.map(position => {
      return <Row position={position} key={position.entryPrice} />
    })
  }

  render() {

    return (
      <div className="table-wrapper">
        <table className="table">
          <caption className="table-caption">The current positions</caption>
          <thead className="table-head">
            <tr>
              <th className='table-head-item'>Pair</th>
              <th className='table-head-item'>EntryPrice</th>
              <th className='table-head-item'>Side</th>
              <th className='table-head-item'>Size</th>
              <th className='table-head-item'>PnL</th>
              <th className='table-head-item'>View Position</th>
            </tr>
          </thead>
          <tbody>
            {this.makeRows()}
          </tbody>
        </table>
      </div>

    )
  }
}
