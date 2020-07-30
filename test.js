require('dotenv').config()
process.env.NTBA_FIX_319 = 1;
const exchange = require('./scripts/exchange')
const CCXT = require('ccxt')
const TelegramBot = require('node-telegram-bot-api')
const token = process.env.TELEGRAM_TOKEN
const chatId = process.env.TELEGRAM_CHAT_ID
const bot = new TelegramBot(token, { polling: true })

bot.sendMessage(1327709085, 'hello tehre')