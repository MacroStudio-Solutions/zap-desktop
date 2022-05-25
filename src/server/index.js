const express = require("express");
const cors = require("cors");

const server = express();
server.use(cors());
server.use(express.json());

const setWindow = {
    window: null,
    key: ""
}

server.use((req, res, next) => {
    req.window = setWindow.window;
    req.key = setWindow.key;
    next();
});

const routes = require('../api/routes/')
server.use('/', routes)

module.exports = { server, setWindow };