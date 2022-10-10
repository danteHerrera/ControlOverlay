const WebSocket = require("ws");

// Starts websocket server on port 8082
const wss = new WebSocket.Server({ port: 8082 });

//Listen for a client connecting to server
//ws refers to only one client, wss refers to actual server
wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", data => {
        let d;
        console.log(`Client has sent us: ${data}`);
        if (data == "Connection Established") {
            return;
        }
        try {
            d = JSON.parse(data);
            ws.send(JSON.stringify(d));
        } catch (e) {
            console.log(`Something went wrong with the message: ${e.message}`)
        }
        console.log(JSON.parse(data));
    })

    ws.on("close", () => {
        console.log("Client has disconnected");
    })
})


// FIGURE OUT WHY IMPORT IS NOT WORKING!!!