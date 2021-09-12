import moment from 'moment';
import TelegramBot from 'node-telegram-bot-api';
import internal from 'stream';
const mysql = require("mysql2");
var config = require('./config.json');
var strings = require('./strings.json');
var logger = require('./logger.js');
var helpers = require('./helpers.js');

const token = config.telegram.token;

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
    logger.info("Got text message: %O", msg);
    const chatId = msg.chat.id;
    if(msg.text == '/start' || msg.text == '/get_code'|| msg.text == '🌀Получить код🌀'){
        logger.info("/get_code");
        connection.query("SELECT expires_at, code FROM telegram_auth WHERE chat_id=?",[chatId], async function (error: any, results: Array<any>, fields: any) {
            let currentTime = moment();
        
            if(results !== undefined && results.length > 0 && currentTime.diff(results[0].expires_at, 'seconds') < 0){
                logger.info("Code for this chat is already in the database and is not yet expired");
                await bot.sendSticker(msg.chat.id, strings.stickers['🌴']);
                bot.sendMessage(chatId, helpers.inject(strings.langs.ru.code_still_valid, {"confirmCode" : results[0].code}),{parse_mode: 'HTML', reply_markup: keyboard.reply_markup},);
            } else {
                logger.info("Generating new code...");
                connection.query("SELECT code FROM telegram_auth", async function (error: any, results: Array<any>, fields: any) {
                    if (results === undefined) {
                        results = [];
                    } else {
                        results = results.map((e: { code: string; }) => e.code);
                    }
                    logger.info("Fetched %s codes from telegram_auth table", [results.length]);
                    let confirmCode:string = '';
                    for(let i:number = 0; i <= 10000; i++){
                        confirmCode =  String(getRandom());
                        if(!results.includes(confirmCode)){
                            break;
                        }
                    }
                    logger.info("Generated code: %s", [confirmCode]);
                    dataBase(chatId, msg.chat.username, confirmCode);
                    logger.info("Inserted new code into database");
                    await bot.sendSticker(msg.chat.id, strings.stickers['👋'],);
                    bot.sendMessage(chatId, helpers.inject(strings.langs.ru.start, {"confirmCode" : confirmCode}),{parse_mode: 'HTML', reply_markup: keyboard.reply_markup},);
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

        if (results !== undefined && results.length > 0) {
            connection.query("UPDATE telegram_auth SET username = ?, code = ?, expires_at = ? WHERE chat_id = ?", [username, confirmCode, expiresAt, chatId]);
        } else {
            connection.query("INSERT INTO telegram_auth (chat_id, username, code, expires_at) VALUES (?, ?, ?, ?) ",
            [chatId, username, confirmCode, expiresAt]);
        }
    });
};