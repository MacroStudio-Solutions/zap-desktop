const axios = require("axios").default;

const useCheckServer = async (port) => {

    const resCheck = await axios.get(`https://localhost:${port}/misc/check-server`)
        .catch(e => {
            console.log("Connection refused: No server running")
        });

    if (resCheck && resCheck.status === 200) return true;
    
    return false;
}

module.exports = useCheckServer