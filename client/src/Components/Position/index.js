import React, { Component } from 'react';
import './position.css'




class Position extends Component {
  constructor(props) {
    super(props)
    this.state = this.props.location.state
    console.log(`state is`, this.state);
  }

  onComponentDidMount() {
    this.setState(this.props.location.state)
  }

  calculatePnl(position) {

    function accumulateSize(object) {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const data = object.fill.map(fill => fill.size).reduce(reducer)
      return data
    }
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

    const entryAmount = accumulateSize(position.entryOrder)
    const entryPrice = orderPriceAverage(position.entryOrder)
    const entryResult = entryAmount * entryPrice
    const entryOrderFee = accumulateFee(position.entryOrder)

    const stopAmount = entryAmount;
    const stopPrice = orderPriceAverage(position.stopOrder)
    const stopResult = stopAmount * stopPrice;
    const stopOrderFee = accumulateFee(position.stopOrder)



    const result = entryPrice > stopPrice ? ((entryResult - stopResult) * -1) - entryOrderFee - stopOrderFee : entryResult - stopResult - entryOrderFee - stopOrderFee
    return result.toFixed(2)

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
            Profit and loss: {this.calculatePnl(this.state)}
          </p>
        </div>
      </div>
    )
  }
}

export default Position