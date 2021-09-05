import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import internal from 'stream';
const mysql = require("mysql2");
var config = require('./config.json');
const token = config.token;

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
            if(results.length > 0 && currentTime.diff(results[0].expires_at, 'seconds') < 180){
                await bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC25FhNKmixHt1Co8ekvpHCvl9Hfkm5AACYAAD29t-AAGGKUzOUOHn4SAE',{reply_markup: keyboard.reply_markup});
                bot.sendMessage(chatId, `🔒Код авторизации: <b>${results[0].code}</b>\n⏳Срок действия еще не истек`,{parse_mode: 'HTML'},);
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
                await bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC2fthM4zNG2JoR9MQ6eQ4aHo9f6yFwwACbwAD29t-AAGZW1Coe5OAdCAE',{reply_markup: keyboard.reply_markup});
                bot.sendMessage(chatId, `🔒Код авторизации: <b>${confirmCode}</b>\n🚨Активен в течение 3 минут`,{parse_mode: 'HTML'},);
                });
            }
        });
    } else {
        await bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC29phNM9cCe67OWpp3uupByNK5Xd6BwACYwAD29t-AAGMnQU950KD5yAE');
        bot.sendMessage(chatId, `Простите, я не знаю как вам ответить`,{parse_mode: 'HTML'},{reply_markup: keyboard.reply_markup}, );

    }
    
});

function getRandom():number{
    let result:number = Math.floor((Math.random() * 8999) + 1001);
    return result;  
};

function dataBase(chatId: any, username:any, confirmCode:string ){
    var moment = require('moment');
    var expiresAt = moment().add(3, 'minutes').format('YYYY-MM-DD hh:mm:ss');
    console.log(expiresAt);
    connection.query("SELECT * FROM telegram_auth WHERE chat_id=?", [chatId], function (error: any, results: any, fields: any) {
        if (results.length > 0) {
            connection.query("UPDATE telegram_auth SET code = ? WHERE chat_id = ?", [confirmCode, chatId]);
        } else {
            connection.query("INSERT INTO telegram_auth (chat_id, username, code, expires_at) VALUES (?, ?, ?, ?) ",
            [chatId, username, confirmCode, expiresAt]);
        }
    });
};