import React, { Component } from "react"
import axios from "axios"

import "./App.css"

class App extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
    }
  }

  componentDidMount() {
    axios
      .get("http://localhost:3001/position")
      .then((response) => {
        this.setState({ data: response.data.result })
      })
      .catch((error) => {
        console.log(error)
      })
  }

  markets() {
    return this.state.data.map((item) => {
      return <p>{JSON.stringify(item)}</p>
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Title</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault()
          }}
        >
          {this.markets()}
        </form>
      </div>
    )
  }
}

export default App
