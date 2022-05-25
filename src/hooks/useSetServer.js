const axios = require("axios").default;
const MAX_TRIES = 10;

const useSetServer = async (config, tryCounter = 1) => {
    const setServer = await axios.post("https://zapdelivery.me/local/setserver", config, 
    {
        headers: {
            Authorization: "87rt321n321w65r4w65r4h76ykj6354s35E4G36R5H4DF6435"
        }
    })

    if (tryCounter === MAX_TRIES) return;
    tryCounter++;
    if (setServer && setServer.status !== 200) setTimeOut(() => { useSetServer(config, tryCounter) }, 1000)
}

module.exports = useSetServer;