import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import internal from 'stream';
const mysql = require("mysql2");
var config = require('./config.json');
const token = config.token;

var keyboard = { 
        reply_markup: {
            keyboard: [
                [{text: "🌀Обновить код🌀"}],[],[],[]
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




bot.onText(/\/start/ ,async (msg, match) => {
    const chatId = msg.chat.id;
    let confirmCode:string = String(getRandom());
    dataBase(chatId, msg.chat.username, confirmCode);
    await bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC2fthM4zNG2JoR9MQ6eQ4aHo9f6yFwwACbwAD29t-AAGZW1Coe5OAdCAE',{reply_markup: keyboard.reply_markup});
    bot.sendMessage(chatId, `🔒Код авторизации: <b>${confirmCode}</b>\n🚨Активен в течение 3 минут`,{parse_mode: 'HTML'},);
});


bot.onText(/🌀Обновить код🌀/ ,async (msg, match) => {
    const chatId = msg.chat.id;
    let confirmCode:string = String(getRandom());
    dataBase(chatId, msg.chat.username, confirmCode);
    await bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC2gJhM417Tjd8xHpgh82944UhZOO7jgACXwAD29t-AAGEsFSbEa7K4yAE');
    bot.sendMessage(chatId, `🔒Код авторизации: <b>${confirmCode}</b>\n🚨Активен в течение 3 минут`,{parse_mode: 'HTML'},{reply_markup: keyboard.reply_markup}, );
});



function getRandom():number{
    let result:number = Math.floor((Math.random() * 8999) + 1001);
    return result;  
};


function dataBase(chatId: any, username:any, confirmCode:string ){
    var moment = require('moment')
    var expiresAt = moment().format('YYYY-MM-DD hh:mm:ss')
    console.log(expiresAt);
    
    // connection.query("SELECT * FROM telegram_auth WHERE code=?",[confirmCode], function (error: any, results: any, fields: any){
        
    // });`
    connection.query("SELECT * FROM telegram_auth WHERE chat_id=?", [chatId], function (error: any, results: any, fields: any) {
        if (results.length > 0) {
            connection.query("UPDATE telegram_auth SET code = ? WHERE chat_id = ?", [confirmCode, chatId]);
        } else {
            connection.query("INSERT INTO telegram_auth (chat_id, username, code, expires_at) VALUES (?, ?, ?, ?) ",
            [chatId, username, confirmCode, expiresAt]);
        }
    });
};