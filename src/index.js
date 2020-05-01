require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// replace the value below with the Telegram token you receive from @BotFather
const token = process.env.DAPP_PLAYER_TOKEN;
console.log("env DAPP_PLAYER_TOKEN", token);

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

console.log("starting engine");
// Matches "/echo [whatever]"

bot.onText(/\/echo (.+)/, (msg, match) => {
  const user = msg.from.username;
  console.log(msg.from.username);
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

const gameName = 'dappplayer';
const queries = {};
const dappSet = {};

bot.onText(/^\/(game|dapp)(.*)/, (msg, match) => {
  const user = msg.from.username;
  console.log(msg.from.username);
  // 'msg' is the received Message from Telegram
  // 'match' is the result of executing the regexp above on the text content
  // of the message

  const chatId = msg.chat.id;
  const resp = match[2]; // the captured "whatever"
  console.log('resp', resp);
  dappSet[user] = resp ? resp.replace(' ', '').toLowerCase() : '';

  dappSet[user] = dappSet[user] || 'https://meta.loft.radio';
  if(dappSet[user] === 'loft') {
    dappSet[user] = 'https://meta.loft.radio';
  }

  if(dappSet[user] === 'uniswap' || dappSet[user] === 'swap') {
    dappSet[user] = 'https://uniswap.exchange/swap/0x87d7b6CfAaeC5988FB17AbAEe4C16C3a79ceceB0';
  }

  console.log('user setting:', dappSet[user]);

  // send back the matched "whatever" to the chat
  // bot.sendMessage(chatId, resp);
  bot.sendGame(msg.from.id, gameName)
});

bot.on("inline_query", function(iq) {
  console.log('iq', iq);
  bot.answerInlineQuery(iq.id, [ { type: "game", id: "0", game_short_name: gameName } ] );
});

bot.on("callback_query", function (query) {
  console.log('callback_query', query);

  if (query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
    console.log('does not match');
    bot.answerCallbackQuery(query.id, "Sorry, '" + query.game_short_name + "' is not available.");
  } else {
    const user = query.from.username; // id
    queries[query.id] = query;
    const url = dappSet[user]; // `https://meta.loft.radio`;

    let gameurl = `https://dapp.d23bu67krj8run.amplifyapp.com/dapp?url=${url}&id=`+query.id;
    bot.answerCallbackQuery({
      callback_query_id: query.id,
      url: gameurl
    });
  }
});