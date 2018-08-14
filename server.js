const OSC = require('osc-js')
const express = require('express')

const HTTP_SERVER_PORT = 3000
const WS_SERVER_PORT = 9000
const UDP_SERVER_PORT = 41234


// Express server for static file hosting
const app = express()

app.use('/', express.static('dist'))

app.listen(HTTP_SERVER_PORT, () => {
    console.log('HTTP server ready')
})


const options = {
    receiver: 'ws',
    udpServer: {
        host: 'localhost', // @param {string} Hostname of udp server to bind to
        port: UDP_SERVER_PORT, // @param {number} Port of udp server to bind to
        exclusive: false // @param {boolean} Exclusive flag
    },
    // udpClient: {
    //     host: 'localhost', // @param {string} Hostname of udp client for messaging
    //     port: WS_SERVER_PORT // @param {number} Port of udp client for messaging
    // },
    wsServer: {
        host: 'localhost', // @param {string} Hostname of WebSocket server
        port: WS_SERVER_PORT // @param {number} Port of WebSocket server
    }
}

const osc = new OSC({
    plugin: new OSC.BridgePlugin(options),
})

let interval;
osc.on('open', () => {
    console.log('OSC server ready')
    interval = setInterval(sendMessage, 300)
})

osc.on('/glottis', message => {
    osc.send(new OSC.Message(message.address, message.args[0], message.args[1]));
});

osc.open()


function sendMessage() {
    // test OSC data for client
    // replace this with routing to external programs like MaxMSP

    const isTouched = String(Boolean(new Date().getMilliseconds() % 2));
    osc.send(new OSC.Message('/glottis', 'isTouched', isTouched));

    const semitone = (new Date().getMilliseconds() / 100) % 24;
    osc.send(new OSC.Message('/glottis', 'semitone', semitone));

    const tenseness = (new Date().getMilliseconds() / 1000);
    osc.send(new OSC.Message('/glottis', 'tenseness', tenseness));

    const loudness = Math.abs(Math.sin(new Date().getMilliseconds()))
    osc.send(new OSC.Message('/glottis', 'loudness', loudness));

    const vibratoAmount = Math.abs(Math.sin(new Date().getMilliseconds())) * .25;
    osc.send(new OSC.Message('/glottis', 'vibratoAmount', vibratoAmount));

    const vibratoFrequency = Math.abs(Math.sin(new Date().getMilliseconds())) * 20;
    osc.send(new OSC.Message('/glottis', 'vibratoFrequency', vibratoFrequency));

}


osc.on('error', err => {
    console.error('!!!!', err);
    debugger
})

osc.on('close', () => {
    console.log('OSC server closed')

    if (interval) {
        clearTimeout(interval)
    }
});