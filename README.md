### Trading App React Testing

## SCOPE OF APP:

The itnention of this app is to place and manage positions, without the main strategy but with the order management rules

## TODO

# Tidy Up code:

The code is all over the place, Clean it up:

- [x] No functions inside of the routes
- [] Have different modules for different core functionality such as managing orders and tracking getPrices
  - [x] Order Manager:
    - [x] Post order function - posts an order with paramaters - [X] TESTED
    - [x] Stop breach before entry function - takes in price and cancels orders on pair when stop is breached
    - [] TEST
  - [x] Pair Manager:
    - [x] Track Price function - takes in an array of pairs, tracks price (Maybe use a promise, on resolve, set variable to new array of prices)
  - [] Positon Manager(for the position logic? takes in the order from the route and does calls in other modules such as Pair Manager and Order Manager):
  - [] Database Manager
    - [] push new position function - pushes new position to database
    - [] Update position function - updates previously pushed position with new information (ie. closed price)

# Order Input:

- Frontend

  - [x] Order input Form
  - [x] Logic for posting order to backend

- Backend
  - [x] Logic for posting order to FTX

# Managing Order

- Backend
  - [x] Watching price, ping serever every 10th of a second
  - [] Setup MongoDB
    - [x] app.js setup
    - [x] Schema
    - [x] Post position to database on entry order creation (temporary way to test, wil)
    - [x] make position entry
  - [] Stop Breach function for managing stop breach before entry (already made, reuse from ftx script)
  - [] Three candle function for
  - [] Stop order place function

# Trading Account Size

- [x] Front-end to ask backend for data
- [x] backend to ask servers for database
- [x] Send balance information back to frontend
- [x] set trade amount based on portfoliosize
- [x] on app load, get account size from etherscan.io and ftx (using environment variables for privacy)
