function log(msg: string, options: Array<any> = []) {
    const now = (new Date())
    const date = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    console.log("[" + date + "] " + msg, options);
};
function error(msg: string, options: Array<any> = []) {
    const now = (new Date())
    const date = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    console.error("[" + date + "] " + msg, options);
};

module.exports = {
    log: log
}