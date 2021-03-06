import React from 'react'
import { Link } from 'react-router-dom'
import './nav.css'

function Nav() {
  return (
    <nav className="nav">
      <ul className="nav-ul">
        <li className="nav-li">
          <Link exact="true" to="/" className="nav-link">
            Order Input
          </Link>
        </li>
        <li className="nav-li">
          <Link exact="trie" to="/overview" className="nav-link">
            Overview
          </Link>
        </li>
        <li className="nav-li">
          <Link exact="true" to="/positions" className="nav-link">
            Positions
          </Link>
        </li>
        <li className="nav-li">
          <Link exact="true" to="/tradelog" className="nav-link">
            Trade Log
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Nav
