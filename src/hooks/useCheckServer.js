const axios = require("axios").default;

const useCheckServer = async (port) => {

    const resCheck = await axios.get(`http://localhost:${port}/app-zap-running`).catch(e => {
        console.log("No server running")
    });    

    if (resCheck && resCheck.status === 200) return false;
    
    return true;

}

module.exports = { useCheckServer };