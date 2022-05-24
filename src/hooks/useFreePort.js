const freeport = require("freeport");

const useFreePort = async () => {

    return new Promise((resolve, reject) => {
        freeport(function (err, port) {
            if (err) reject(err)
            resolve(port)
        })
    });
    
}

module.exports = { useFreePort };