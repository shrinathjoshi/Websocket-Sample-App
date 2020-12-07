const WebSocket =  require('ws');
const wss =  new WebSocket.Server({port:8082});
var path = require('path');
const childProcess = require('child_process');
const fs = require('fs');
buf = new Buffer(4096);

wss.on("connection", ws => {
    console.log("New Client connected");

    ws.on("message",data => {
    //    console.log(`The client has send:- ${data}`);

        const filename = path.resolve(__dirname, 'log.txt');

        fs.open(filename, 'r', function (err, fd) {
            if (err) {
                console.error('Unable to open: ' + filename);
                return;
            }

            fs.watchFile(filename, function (curr, prev) {
                var len = curr.size - prev.size, position = prev.size;
                if (len > 0) {
                    fs.read(fd, buf, 0, len, position,
                        function (err, bytesRead, buffer) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            var msg = buffer.toString('utf8', 0, bytesRead);
                            console.log(msg);
                            ws.send(msg);
                        });
                } else {
                    console.log(curr);
                }
            });

        });
    
    ws.on("close",()=>{
        console.log(" Client has disconnected");
    });

    });


});






// const express = require('express');

// const app = express();
// const server = require('http').createServer(app);
// const io = require('socket.io')(server);
// const os = require('os');
