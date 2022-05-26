const { readFileSync, writeFileSync } = require("fs");
const { v4: uuidv4 } = require("uuid");
const { getDir } = require("./rootDirs")
const log = require("../utils/log");
const ENCODE = "utf8";

const getWindowId = (storeId) => {

    log("Get window key - " + getDir("keys") + `/${storeId}.key`);

    const pathToFile = getDir("keys") + `/${storeId}.key`;

    let exists = false;
    let windowKey = uuidv4();

    try {
        windowKey = readFileSync(pathToFile, ENCODE);
        exists = true;
    } catch (e) {
        exists = false;
        log("Get window key failed");
    }

    if (!exists) writeFileSync(pathToFile, windowKey, ENCODE);
    return windowKey;
}

module.exports = getWindowId;