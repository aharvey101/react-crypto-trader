import React, { Component } from 'react'
import axios from 'axios'


export default class TableOfPositions extends Component {
  constructor() {
    super()
    this.state = {}

    this.getPositions = this.getPositions.bind(this)
  }
}
