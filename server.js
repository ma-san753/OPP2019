const express = require("express");
const app = express();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);
const geolib = require("geolib");


/* app.get("/", function (req, res) {
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
}) */

/*緯度: 35.689775 経度: 139.78256*/

const mistLocation = {
  latitude: 35.689775,
  longitude: 139.78256
}

const storedData = [];

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("send", function (receivedData) {
    const senderLocation = {latitude: receivedData.latitude, longitude: receivedData.longitude};
    const distance = geolib.getDistance(mistLocation, senderLocation, 0.1);
    const nowDate = new Date;
    const data = {humidity: receivedData.humidity, latitude: receivedData.latitude, longitude: receivedData.longitude, distance: distance, date: nowDate};
    storedData.push(data);

    const searchedData = storedData.filter(function(queryData) {
      queryData.distance < 10 && nowDate.now() - queryData.date.now < 60000;
    });
    
    if(searchedData.length < 10) {
      io.emit("move", "MOVE");
    }
  })

  socket.on("test", function (data) {
    console.log(data);
  })

  socket.on("disconnect", function () {
    console.log("user disconnected.")
  });
});

http.listen(80, function () {
  console.log("listening on port:80.");
});