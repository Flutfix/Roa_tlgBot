var helpers = require('./helpers.js')

function log(msg: string, options: Array<any> = []) {
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] ${1}", [date, msg]), options);
}

function error(msg: string, options: Array<any> = []) {
    const date = helpers.formatDate(new Date());
    console.error(helpers.inject("[${0}] ERROR ${1}", [date, msg]), options);
}

function info(msg: string, options: Array<any> = []) {
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] INFO ${1}", [date, msg]), options);
}

function warn(msg: string, options: Array<any> = []) {
    const date = helpers.formatDate(new Date());
    console.log(helpers.inject("[${0}] WARN ${1}", [date, msg]), options);
}

module.exports = {
    info: info,
    warn: warn,
    error: error
}