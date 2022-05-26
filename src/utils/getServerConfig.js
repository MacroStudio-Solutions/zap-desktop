const ip = require("ip");
const https = require('https');

const { server, setWindow } = require("../server");
const getWindowKey = require("./getWindowKey")
const useCheckServer = require("../hooks/useCheckServer");
const useSetServer = require("../hooks/useSetServer");
const { getCert } = require("../hooks/useCertificate")
const log = require("../utils/log");

const MS_RETRIES = 3000
const LOCAL_IP = ip.address();

const getServerConfig = (mainWindow) => {

    mainWindow.webContents.executeJavaScript('localServer', true)
        .then(async (result) => {

            if (result) {
                const windowKey = getWindowKey(result.storeId)
                setWindow.key = windowKey;

                if (!await useCheckServer(result.port)) {

                    log("Creating server")

                    try {
                        const credentials = getCert();
                        https.createServer(credentials, server).listen(result.port, async () => {
                            let newServerConfig = { ...result, windowKey: windowKey, ip: LOCAL_IP }
                            useSetServer(newServerConfig);

                            mainWindow.webContents.executeJavaScript('window.isServer = true;', true)
                                .then((result) => {
                                    console.log(`Window "${windowKey}" is the server`);
                                    log(`Window "${windowKey}" is server`)
                                })
                                .catch((e) => {
                                    console.log("Failed to set server on web contents")
                                    log("Failed to set server on web contents")
                                });

                            console.log(`Server listen in https://${LOCAL_IP}:${result.port}`);
                        });
                    } catch (e) {
                        log("Fail to create server")
                    }
                }
                
            } else {
                log("Getting local server info result failed")
                setTimeout(() => { getServerConfig(mainWindow) }, MS_RETRIES)
            }
        })
        .catch((e) => {
            log("Getting local server info failed")
            log(`${e}`)

            setTimeout(() => { getServerConfig(mainWindow) }, MS_RETRIES)
        });
}

module.exports = getServerConfig