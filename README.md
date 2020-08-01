### Trading App React Testing

# Known Errors:

- [x] Position.create() doesn't return a value. This is needed to update the position when the stop is triggered

# SCOPE OF APP:

The itnention of this app is to place and manage positions, without the main strategy but with the order management rules

# TODO - Backend

- [x] Stop loop after position entry, stop placed and database updated with stopOrder

- [] add functionality to update positions as needed on the frontend (Basically a way to add the fills in for the orders after the position is closed)

- [x] Figure out how to get fills in: AN IDEA: Use a websocket to get fills, when a fill comes in, search database for the pair the fill is on. find the matching entries with fills that don't complete that order (buy or sell, entry or stop). Alternatively, add a boolean to the Position model to signify that the order is filled

- [] Remove unnessary functions

# TODO Frontend

- [] Add Trade Log functions

  - [x] Date time
  - [x] Strategy (if no strategy, assume cradle)
  - [x] Trigger timeframe
  - [] Trade Rating (maybe hold off on this,)
  - [x] PnL
  - [x] \$ Risked
  - [x] Slippage

- [] All trade log functions should be added to backend to update position

- Overview
  - [] Graph of account size: Thought, for every trade, take total profit or loss off previous account balance, much like a spreadsheet.

## Edit Trades Functionality

- [] Frontend - Edit page
- [] Backend - update route

## Telegram Bot

- [] There is a problem with initializing teh bot twice, need to fix
