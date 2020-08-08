import React from 'react'
import OrderInput from './Components/OrderInput/'
import TableOfPositions from './Components/TableOfPositions/'
import Nav from './Components/Nav/'
import TradeLog from './Components/TradeLog'
import Position from './Components/Position'
import EditTrade from './Components/EditTrade'
import Overview from './Components/Overview'
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
          <Route exact path='/position/:id' render={(props) => <Position {...props} />} />
          <Route exact path="/position/:id/edit/" render={(props) => <EditTrade {...props} />} />
          <Route exact path="/">
            <OrderInput />
          </Route>
          <Route exact path="/positions">
            <TableOfPositions />
          </Route>
          <Route exact path="/tradelog">
            <TradeLog />
          </Route>
          <Route exact path="/overview">
            <Overview />
          </Route>
        </Switch>
      </div>
    </Router >
  )
}

export default App
