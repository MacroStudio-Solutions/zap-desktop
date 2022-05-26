const { readFileSync, writeFileSync } = require("fs");
//const path = require('path')
const { v4: uuidv4 } = require("uuid");

const getWindowId = (storeId) => {
    //const pathToFile = path.join(__dirname, `./config/${storeId}.key`);
    const pathToFile = `./config/${storeId}.key`;
    
    let exists = false;
    let windowKey = uuidv4();

    try {
        windowKey = readFileSync(pathToFile, "utf8");
        exists = true;
    } catch (e) {
        exists = false;
    }

    if(!exists) writeFileSync(pathToFile, windowKey, "utf8");

    return windowKey;
}

module.exports = getWindowId;