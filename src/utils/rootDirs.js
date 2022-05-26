const root = require("./root");
const { mkdirSync } = require("fs")

const DIR_PREFIX = "/dev";

const DIR_LIST = {
    dev: "/dev",
    tmp: "/tmp",
    config: "/config",
    cert: "/config/cert",
    keys: "/config/keys",
}

const setDirs = () => {
    Object.keys(DIR_LIST).forEach(e => {
        const fullPath = root + DIR_PREFIX + DIR_LIST[e];
        mkdirSync(fullPath, { recursive: true });
    })
}

const getDir = (dir) => {
    return root + DIR_PREFIX + DIR_LIST[dir];
}

module.exports = { setDirs, getDir }