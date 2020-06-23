import React from 'react'
import OrderInput from './Components/OrderInput'
import TableOfPositions from './Components/TableOfPositions'
import Nav from './Components/Nav'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import './App.css'

// Order input
// form for inputing order

function App() {
  return (
    <Router>
      <div className="container">
        <Nav />

        {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/">
            <OrderInput />
          </Route>
          <Route exact path="/positions">
            <TableOfPositions />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

export default App
