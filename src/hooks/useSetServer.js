const axios = require("axios").default;

const MAX_TRIES = 10;

const useSetServer = (localIP, port, uuid, tryCounter = 1) => {

    console.log("tryCounter", tryCounter)

    //requisição do tipo Post com Axios para passar os parametros para a API
    const setServer = await axios.post("https://zapdelivery.me/minhaconta/setserver", {
        ip: localIP,
        port: port,
        running: true,
        windowKey: uuid,
    })

    if (tryCounter === MAX_TRIES) return;

    tryCounter++;

    if (setServer && setServer.status !== 200) setTimeOut(() => { useSetServer(localIP, port, uuid, tryCounter) }, 1000)

}

module.exports = { useSetServer };