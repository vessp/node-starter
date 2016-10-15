'use strict';

//Imports------------------------------------------------------------------------
const express = require('express');
const path = require('path');
const SocketServer = require('ws').Server;


//Server-------------------------------------------------------------------------
const app = express()

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

app.route('/')
    .get((request, response) => {
        response.sendFile(INDEX)
    })

const server = app.listen(PORT, () => {
    console.log(`Listening on ${ PORT }`)
});


//Web Socket---------------------------------------------------------------------
const wss = new SocketServer({ server });
var userCount = 0

wss.on('connection', (ws) => {
    console.log('onConnection');
    userCount++
    yellUserCount()

    ws.on('close', () => {
        console.log('Client disconnected');
        userCount--
        yellUserCount()
    });

    ws.on('message', message => {
        console.log('onMessage: ', message)
        //{type: <TYPE>, payload: <MESSAGE>}
        let json = JSON.parse(message)
        yellMessage(json)
    });
});

function yellMessage(message) {
    wss.clients.forEach(ws => {
        ws.send(JSON.stringify(message))
    });
}

function yellUserCount() {
    yellMessage({
        'type':'userCount',
        'message': userCount
    })
}