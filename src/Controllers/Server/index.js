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
    window: null
}

server.use((req, res, next) => {
    req.window = setWindow.window;
    next();
});

index(server);

module.exports = { server, setWindow };