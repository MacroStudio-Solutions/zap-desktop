const root = require("./root");
const { writeFileSync, appendFileSync, existsSync } = require("fs");
const ENCODE = "utf8";

const log = (message) => {

    // disable
    return;

    const pathToLog = `${root}/log.txt`;

    const formatedDate = new Date().toLocaleString();
    const formatMessage = `${formatedDate} - ${message}\n`

    if (!existsSync(pathToLog)) writeFileSync(pathToLog, "", ENCODE);
    appendFileSync(pathToLog, formatMessage, ENCODE);

    return;
}

module.exports = log