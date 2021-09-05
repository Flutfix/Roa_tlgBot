"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment_1 = __importDefault(require("moment"));
var node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
var mysql = require("mysql2");
var config = require('./config.json');
var token = config.token;
var keyboard = {
    reply_markup: {
        keyboard: [
            [{ text: "🌀Получить код🌀" }], [], [], []
        ],
        resize_keyboard: true,
    }
};
var connection = mysql.createConnection(config.mysql);
connection.connect(function (err) {
    if (err) {
        return console.error("Ошибка: " + err.message);
    }
    else {
        console.log("Подключение к серверу MySQL успешно установлено");
    }
});
var bot = new node_telegram_bot_api_1.default(token, { polling: true });
bot.on('text', function (msg, match) { return __awaiter(void 0, void 0, void 0, function () {
    var chatId;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chatId = msg.chat.id;
                if (!(msg.text == '/start' || msg.text == '🌀Получить код🌀')) return [3 /*break*/, 1];
                connection.query("SELECT expires_at, code FROM telegram_auth WHERE chat_id=?", [chatId], function (error, results, fields) {
                    return __awaiter(this, void 0, void 0, function () {
                        var currentTime;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    currentTime = (0, moment_1.default)();
                                    if (!(results.length > 0 && currentTime.diff(results[0].expires_at, 'seconds') < 180)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC25FhNKmixHt1Co8ekvpHCvl9Hfkm5AACYAAD29t-AAGGKUzOUOHn4SAE', { reply_markup: keyboard.reply_markup })];
                                case 1:
                                    _a.sent();
                                    bot.sendMessage(chatId, "\uD83D\uDD12\u041A\u043E\u0434 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438: <b>" + results[0].code + "</b>\n\u23F3\u0421\u0440\u043E\u043A \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u044F \u0435\u0449\u0435 \u043D\u0435 \u0438\u0441\u0442\u0435\u043A", { parse_mode: 'HTML' });
                                    return [3 /*break*/, 3];
                                case 2:
                                    connection.query("SELECT code FROM telegram_auth", function (error, results, fields) {
                                        return __awaiter(this, void 0, void 0, function () {
                                            var confirmCode, i;
                                            return __generator(this, function (_a) {
                                                switch (_a.label) {
                                                    case 0:
                                                        results = results.map(function (e) { return e.code; });
                                                        confirmCode = '';
                                                        for (i = 0; i <= 10000; i++) {
                                                            confirmCode = String(getRandom());
                                                            if (!results.includes(confirmCode)) {
                                                                break;
                                                            }
                                                        }
                                                        dataBase(chatId, msg.chat.username, confirmCode);
                                                        return [4 /*yield*/, bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC2fthM4zNG2JoR9MQ6eQ4aHo9f6yFwwACbwAD29t-AAGZW1Coe5OAdCAE', { reply_markup: keyboard.reply_markup })];
                                                    case 1:
                                                        _a.sent();
                                                        bot.sendMessage(chatId, "\uD83D\uDD12\u041A\u043E\u0434 \u0430\u0432\u0442\u043E\u0440\u0438\u0437\u0430\u0446\u0438\u0438: <b>" + confirmCode + "</b>\n\uD83D\uDEA8\u0410\u043A\u0442\u0438\u0432\u0435\u043D \u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435 3 \u043C\u0438\u043D\u0443\u0442", { parse_mode: 'HTML' });
                                                        return [2 /*return*/];
                                                }
                                            });
                                        });
                                    });
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    });
                });
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, bot.sendSticker(msg.chat.id, 'CAACAgIAAxkBAAEC29phNM9cCe67OWpp3uupByNK5Xd6BwACYwAD29t-AAGMnQU950KD5yAE')];
            case 2:
                _a.sent();
                bot.sendMessage(chatId, "\u041F\u0440\u043E\u0441\u0442\u0438\u0442\u0435, \u044F \u043D\u0435 \u0437\u043D\u0430\u044E \u043A\u0430\u043A \u0432\u0430\u043C \u043E\u0442\u0432\u0435\u0442\u0438\u0442\u044C", { parse_mode: 'HTML' }, { reply_markup: keyboard.reply_markup });
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
function getRandom() {
    var result = Math.floor((Math.random() * 8999) + 1001);
    return result;
}
;
function dataBase(chatId, username, confirmCode) {
    var moment = require('moment');
    var expiresAt = moment().add(3, 'minutes').format('YYYY-MM-DD hh:mm:ss');
    console.log(expiresAt);
    connection.query("SELECT * FROM telegram_auth WHERE chat_id=?", [chatId], function (error, results, fields) {
        if (results.length > 0) {
            connection.query("UPDATE telegram_auth SET code = ? WHERE chat_id = ?", [confirmCode, chatId]);
        }
        else {
            connection.query("INSERT INTO telegram_auth (chat_id, username, code, expires_at) VALUES (?, ?, ?, ?) ", [chatId, username, confirmCode, expiresAt]);
        }
    });
}
;
