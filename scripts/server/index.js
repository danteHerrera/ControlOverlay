// Look up https://karlhadwen.medium.com/node-js-websocket-tutorial-real-time-chat-room-using-multiple-clients-44a8e26a953e for clarity :)
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const port = 6969;
const server = http.createServer(express);
const wss = new WebSocket.Server({ server })

wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(data) {
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === 1) {
                if (JSON.parse(data) instanceof Object) {
                    client.send(JSON.stringify(JSON.parse(data)));
                }
            }
        })
    })
})

server.listen(port, function () {
    console.log(`Server is listening on ${port}!`)
})