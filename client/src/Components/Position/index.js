import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import './position.css'

class Position extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.location.state

  }

  onComponentDidMount() {
    this.setState(this.props.location.state)
  }



  render() {
    return (
      <div className="container">
        <h1>{this.state.pair}</h1>
        <div className="position-entry-images__wrapper">
          <div className="position-entry-images__image-container">
            <h3>Entry Timeframe</h3>
            <a href='#tf1'>
              <img src={this.state.tf1} className="position-entry-images__image" alt="entry image"></img>
            </a>
          </div>
          <a href='#' id="tf1" className="position-entry__lightbox">
            <img className="position-entry__lightbox-image" src={this.state.tf1} alt="entry image"></img>
          </a>
          <div className="position-entry-images__image-container">
            <h3>Timeframe 2</h3>
            <a href="#tf2">
              <img src={this.state.tf2} className="position-entry-images__image" alt="entry image"></img>
            </a>
          </div>
          <a href='#' id="tf2" className="position-entry__lightbox">
            <img className="position-entry__lightbox-image" src={this.state.tf2} alt="entry image"></img>
          </a>
          <div className="position-entry-images__image-container">
            <h3>Timeframe 3</h3>
            <a href="#tf3">
              <img src={this.state.tf3} className="position-entry-images__image" alt="entry image"></img>
            </a>
          </div>
          <a href='#' id="tf3" className="position-entry__lightbox">
            <img className="position-entry__lightbox-image" src={this.state.tf3} alt="entry image"></img>
          </a>
        </div>
        <div className="position-information__wrapper">
          <h3 className="position-information__title-entry">Entry Order information</h3>
          <p>
            Entry: {this.state.entry}
          </p>
          <p>
            Stop: {this.state.stop}
          </p>
          <p>
            Size: {this.state.positionSize}
          </p>
          <p>
            Date: {this.state.date}
          </p>
          <h3 className="position-information__title-Exit">Exit information</h3>
          <p>
            Profit and loss: {this.state.pnl}
          </p>
          {/* <td className="table-body-item" >{slippage(props.position)}%</td> */}
          <Link exact='true' to={{ pathname: `/position/${this.state._id}/edit/`, state: this.state }}><button>Edit</button></Link>

        </div>
      </div>
    )
  }
}

export default Position