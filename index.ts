import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import internal from 'stream';
const mysql = require("mysql2");
var config = require('./config.json');
var strings = require('./strings.json');
const token = config.telegram.token;

let inject = (str: string, obj: any) => str.replace(/\${(.*?)}/g, (x,g)=> obj[g]);

var keyboard = { 
        reply_markup: {
            keyboard: [
                [{text: "🌀Получить код🌀"}],[],[],[]
            ],
            resize_keyboard: true,
        }
};

const connection = mysql.createConnection(config.mysql);
   connection.connect(function(err: { message: string; }){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });

  
const bot = new TelegramBot(token, { polling: true });


bot.on('text' ,async (msg, match) => {
    const chatId = msg.chat.id;
    if(msg.text == '/start' || msg.text == '🌀Получить код🌀'){

        connection.query("SELECT expires_at, code FROM telegram_auth WHERE chat_id=?",[chatId], async function (error: any, results: Array<any>, fields: any) {
            let currentTime = moment();

            if(results.length > 0 && currentTime.diff(results[0].expires_at, 'seconds') < 0){
                await bot.sendSticker(msg.chat.id, strings.stickers['🌴'],{reply_markup: keyboard.reply_markup});
                bot.sendMessage(chatId, inject(strings.langs.ru.code_still_valid, {"confirmCode" : results[0].code}),{parse_mode: 'HTML'},);
            } else {
                connection.query("SELECT code FROM telegram_auth", async function (error: any, results: Array<any>, fields: any) {
                    results = results.map((e: { code: string; }) => e.code);
                    
                    let confirmCode:string = '';
                    for(let i:number = 0; i <= 10000; i++){
                        confirmCode =  String(getRandom());
                        if(!results.includes(confirmCode)){
                            break;
                        }
                    } 
                dataBase(chatId, msg.chat.username, confirmCode);
                await bot.sendSticker(msg.chat.id, strings.stickers['👋'],{reply_markup: keyboard.reply_markup});
                bot.sendMessage(chatId, inject(strings.langs.ru.start, {"confirmCode" : confirmCode}),{parse_mode: 'HTML'},);
                });
            }
        });
    } else {
        await bot.sendSticker(msg.chat.id, strings.stickers['🤯']);
        bot.sendMessage(chatId, strings.langs.ru.error, {parse_mode: 'HTML', reply_markup: keyboard.reply_markup}, );

    }
    
});

function getRandom():number{
    let result:number = Math.floor((Math.random() * 8999) + 1001);
    return result;  
};

function dataBase(chatId: any, username:any, confirmCode:string ){
    var moment = require('moment');
    var expiresAt = moment().add(3, 'minutes').format('YYYY-MM-DD HH:mm:ss');

    connection.query("SELECT * FROM telegram_auth WHERE chat_id=?", [chatId], function (error: any, results: any, fields: any) {
        if (results.length > 0) {
            connection.query("UPDATE telegram_auth SET username = ?, code = ?, expires_at = ? WHERE chat_id = ?", [username, confirmCode, expiresAt, chatId]);
        } else {
            connection.query("INSERT INTO telegram_auth (chat_id, username, code, expires_at) VALUES (?, ?, ?, ?) ",
            [chatId, username, confirmCode, expiresAt]);
        }
    });
};