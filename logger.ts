var helpers = require('./helpers.js')
var config = require('./config.js')

function debug(msg: string, options: Array<any> = []) {
    if (config.logLevel < 1) {
        return;
    }
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] DEBUG: ${1}", [date, msg]), options);
}

function info(msg: string, options: Array<any> = []) {
    if (config.log_level < 2) {
        return;
    }
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] INFO: ${1}", [date, msg]), options);
}

function warn(msg: string, options: Array<any> = []) {
    if (config.log_level < 3) {
        return;
    }
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] WARN: ${1}", [date, msg]), options);
}

function error(msg: string, options: Array<any> = []) {
    if (config.log_level < 4) {
        return;
    }
    const date = helpers.formatDate(new Date());
    console.error(helpers.inject("[${0}] ERROR: ${1}", [date, msg]), options);
}

function fatal(msg: string, options: Array<any> = []) {
    if (config.log_level < 5) {
        return;
    }
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] FATAL: ${1}", [date, msg]), options);
}

module.exports = {
    debug: debug, // 1
    info: info, // 2
    warn: warn, // 3
    error: error, // 4
    fatal: fatal, // 5
}
