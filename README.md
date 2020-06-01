### Trading App React Testing

## TODO

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
    - [] Post position to database on entry order creation (temporary way to test, wil)
    - [] make position entry
  - [] Stop Breach function for managing stop breach before entry (already made, reuse from ftx script)
  - [] Three candle function for
  - [] Stop order place function

# Trading Account Size

- [] on app load, get account size from etherscan.io and ftx (using environment variables for privacy)
