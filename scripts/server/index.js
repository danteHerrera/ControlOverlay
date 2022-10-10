const WebSocket = require("ws");

// Starts websocket server on port 8082
const wss = new WebSocket.Server({ port: 8082 });

//Listen for a client connecting to server
//ws refers to only one client, wss refers to actual server
wss.on("connection", ws => {
    console.log("New client connected!");

    ws.on("message", data => {
        console.log(`Client has sent us: ${data}`);
        if (data == "Connection Established") {
            ws.send(data + " - Back End")
            return;
        }
        ws.send(data);
    })

    ws.on("close", () => {
        console.log("Client has disconnected");
    })
})


// FIGURE OUT WHY IMPORT IS NOT WORKING!!!