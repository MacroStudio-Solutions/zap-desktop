const ip = require("ip");
const LOCAL_IP = ip.address();
const getWindowKey = require("./getWindowKey")
const useCheckServer = require("../hooks/useCheckServer");
const useSetServer = require("../hooks/useSetServer");
const { server, setWindow } = require("../server");

const getServerConfig = (mainWindow) => {
    mainWindow.webContents.executeJavaScript('localServer', true)
        .then(async (result) => {
            if (result) {
                const windowKey = getWindowKey(result.storeId)
                setWindow.key = windowKey;
                if (!await useCheckServer(result.port)) {
                    server.listen(result.port, async () => {
                        let newServerConfig = { ...result, windowKey: windowKey, ip: LOCAL_IP }
                        useSetServer(newServerConfig);

                        mainWindow.webContents.executeJavaScript('window.isServer = true;', true)
                            .then((result) => {
                                console.log(`Window "${windowKey}" is the server`);
                            })
                            .catch((e) => {
                                console.log("Failed to set server on web contents")
                            });

                        console.log(`Process listen in http://localhost:${result.port}`);
                    });
                }
            } else {
                setTimeout(() => { getServerConfig(mainWindow) }, 3000)
            }
        })
        .catch((e) => {
            setTimeout(() => { getServerConfig(mainWindow) }, 3000)
        });
}

module.exports = getServerConfig