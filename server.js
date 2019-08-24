const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
  console.log("Request for index.html was received.");
});

app.get("/index.js", function (req, res) {
  res.sendFile(__dirname + "/index.js");
  console.log("Request for index.js was received.");
})

app.get("/output.html", function (req, res) {
  res.sendFile(__dirname + "/output.html");
  console.log("Request for output.html was received.")
})

app.get("/output.js", function (req, res) {
  res.sendFile(__dirname + "/output.js");
  console.log("Request for output.js was received.");
})

io.on("connection", function (socket) {
  console.log("a user connected");
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
    io.emit('chat message', msg);
  });

  socket.on("location", function (location) {
    console.log("Received a location data.");
    console.log(location);
  })

  socket.on("send", function (message) {
    console.log(message);
    io.emit("move", "MOVE");
  })

  socket.on("disconnect", function () {
    console.log("user disconnected.")
  });
});

http.listen(80, function () {
  console.log("listening on port:80.");
});