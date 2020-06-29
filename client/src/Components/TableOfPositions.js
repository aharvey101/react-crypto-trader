import React, { Component } from 'react'
import axios from 'axios'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
const local = 'http://localhost:3001'


const Row = props => (
  <TableRow>
    <TableCell>{props.position.future}</TableCell>
    <TableCell>{props.position.entryPrice}</TableCell>
    <TableCell>{props.position.side}</TableCell>
    <TableCell>{props.position.size}</TableCell>
    <TableCell>{props.position.realizedPnl}</TableCell>
  </TableRow>
)


export default class TableOfPositions extends Component {
  constructor() {
    super()
    this.state = {
      positions: [],
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
    const route = process.env.NODE_ENV === 'production' ? '/getPositions' : `${local}/getPositions`
    const positions = axios.get(route)
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
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Pair</TableCell>
            <TableCell>
              EntryPrice</TableCell>
            <TableCell>Side</TableCell>
            <TableCell> Size</TableCell>
            <TableCell> Pnl</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.makeRows()}
        </TableBody>
      </Table>
    )
  }
}
