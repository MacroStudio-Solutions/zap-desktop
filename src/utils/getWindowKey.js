const { readFileSync, writeFileSync } = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getDir } = require("./rootDirs")
const ENCODE = "utf8";

const getWindowId = (storeId) => {
    const pathToFile = getDir("config") + `/${storeId}.key`;

    let exists = false;
    let windowKey = uuidv4();

    try {
        windowKey = readFileSync(pathToFile, ENCODE);
        exists = true;
    } catch (e) {
        exists = false;
    }

    if (!exists) writeFileSync(pathToFile, windowKey, ENCODE);
    return windowKey;
}

module.exports = getWindowId;