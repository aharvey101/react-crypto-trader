# Crypto React Trading App

This is a Mongo Express React Node stack app built for trading [TraderCobb](https://tradercobb.com/) strategies specifically on the [FTX](ftx.com) exchange.

After a new order has been submitted to the backend, an algorithm is ran that watches the price, submits the information about the position to the database once the trade has been entered, or cancels the orders if the price goes through the stop before entry.

There is also a web socket connection, that is waiting for fills for the orders submitted, once done, it updates the positions in the database accordingly.

## Installation

To get this app running:

1. Clone App
2. npm i
3. Setup required environment variables in a .env file in the root of the app:
   - FTX API Key: API_KEY=""
   - FTX API Secret: API_SECRET=""
   - MongoDBA connection: DATABASEURI=""
   - Ethplorer API (to see the balance of your eth wallet to correctly calculate position size): ethPlorerURI=""
   - Telegram Token: TELEGRAM_TOKEN=""
   - Your Telegram Chat ID: TELEGRAM_CHAT_ID=""
   - ADMINCODE (set to whatever you want) : ADMINCODE=""
4. To make a trade, just input the details, in the order input form and the algorithm does the rest.

There are a few hard coded variables such as the name of the database. You may want to change those but its not necissary.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
