const Telegraf = require('telegraf')
const Extra = require('telegraf/extra')
const coindcx = 'https://api.coindcx.com/exchange/ticker';
const https = require("https")
const Markup = require('telegraf/markup')

const keyboard = Markup.inlineKeyboard([
  Markup.urlButton('❤️', 'http://telegraf.js.org'),
  Markup.callbackButton('Delete', 'delete')
])
 
const bot = new Telegraf(process.env.BOT_TOKEN);
// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('modern', ({ reply }) => reply('Yo'))
// bot.command('hipster', Telegraf.reply('λ'))
// bot.launch()
bot.start((ctx) => ctx.reply('Welcome to CoinDcx Crypto Prices Bot! \n Use /help to get all the supported commands.'));
bot.help((ctx) => ctx.reply('Enter BTC for Bitcoin. \nEnter LTC for Litecoin. \nEnter ETH for Ethereum. \nEnter XRP for Ripple. \n\nOther coins not supported yet. Sorry. ☹️'))

// bot.use((ctx) => {
//     //console.log(ctx.message.text)
//   })
  
//bot.on('message', (ctx) => ctx.telegram.sendCopy(ctx.from.id, ctx.message, Extra.markup(keyboard)))
bot.hears('Hi', (ctx) => ctx.reply('Welcome to CoinDcx Crypto Prices Bot!'));
bot.on('message', function(ctx) {
    var currency;
    var message = ctx.message.text.toString();
    
    if (message.toUpperCase().includes('XRP')) {
        currency = "XRPUSDT";
    }
    else if (message.toUpperCase().includes('BTC')) {
        currency = "BTCUSDT";
    }
    else if (message.toUpperCase().includes('ETH')) {
        currency = "ETHUSDT";
    }
    else if (message.toUpperCase().includes('LTC')) {
        currency = "LTCUSDT";
    }
    else {
        ctx.reply('Please enter a valid text or command. Use /help to get all the supported texts.');
    }
    
    https.get(coindcx, function(res){
        var body = '';
    
        res.on('data', function(chunk){
            body += chunk;
        });
    
        res.on('end', function(){
            var response = JSON.parse(body);
            for(var i in response)
            {                
                if(response[i].market == currency) {                    
                    console.log(response[i].last_price);
                    console.log(response[i].last_price * 70.6);
                    ctx.reply((response[i].last_price * 1.0).toFixed(4) +" USDT");
                    ctx.reply((response[i].last_price * 70.6).toFixed(2) +" INR");
                }            
            }            
        });
    }).on('error', function(e){
          console.log("Api Call Error occured: ", e);
    });
})

bot.catch((err) => {
    console.log('Telegram Error: ', err)
  })

bot.launch()
