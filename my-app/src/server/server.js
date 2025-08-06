import express from 'express';
const server = express();
const port = 3000;

server.listen(port, () => {
    console.log("The server has been activated.");
})