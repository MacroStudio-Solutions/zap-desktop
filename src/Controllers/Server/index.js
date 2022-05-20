const express = require("express");
const cors = require("cors");
const server = express();

const index = require("./Routes");

// const corsOptions = {
//     origin: ["*"],
// };

server.use(cors());
server.use(express.json());

const setWindow = {
    window: null,
    id: ""
}

server.use((req, res, next) => {
    req.window = setWindow.window;
    req.id = setWindow.id;
    
    next();
});

index(server);

module.exports = { server, setWindow };