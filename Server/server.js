/*Used Libraries
  Express (MIT Licence)
    Copyright (c) 2009-2014 TJ Holowaychuk <tj@vision-media.ca>
    Copyright (c) 2013-2014 Roman Shtylman <shtylman+expressjs@gmail.com>
    Copyright (c) 2014-2015 Douglas Christopher Wilson <doug@somethingdoug.com>

  Socket.io (MIT Licence)
    Copyright (c) 2014-2018 Automattic <dev@cloudup.com>

  Geolib (MIT Licence)
    Copyright (c) 2018 Manuel Bie
*/

const app = require('express')();
const http = require("http").createServer(app);
const socketio = require("socket.io");
const io = socketio(http);
const geolib = require("geolib");

//ミスト装置の位置
const mistLocation = {
  latitude: 35.689775,
  longitude: 139.78256
}
//何メートル以内のデータを有効とするか
const emitDistance = 1000000;
//何ミリ秒以内のデータを有効とするか
const emitTime = 60000;
//何件有効なデータがたまったらミスト装置をONにするか
const emitDataNum = 10;
//何ミリ秒間隔で有効なデータを探すか
const emitInterval = 1000;

//データ保存用配列
const storedData = [];

function searchData() {
  const nowDate = new Date;

  const searchedData = storedData.filter(function(queryData) {
    return queryData.distance < emitDistance && nowDate.getTime() - queryData.date.getTime() < emitTime;
  });
  console.log(searchedData);
  
  if(searchedData.length > emitDataNum) {
    io.emit("ON", "ON");
    console.log("mist ON");
  } else {
    io.emit("OFF", "OFF");
    console.log("mist OFF");
  }
}

setInterval(searchData, emitInterval);

io.on("connection", function (socket) {
  console.log("a user connected");

  socket.on("send", function (receivedData) {
    const senderLocation = {latitude: receivedData.latitude, longitude: receivedData.longitude};
    const distance = geolib.getDistance(mistLocation, senderLocation, 0.1);
    const storeDate = new Date;
    const data = {humidity: receivedData.humidity, latitude: receivedData.latitude, longitude: receivedData.longitude, distance: distance, date: storeDate};
    storedData.push(data);
  })

  socket.on("sendON", function (data) {
    io.emit("ON", "ON");
  })

  socket.on("sendOFF", function (data) {
    io.emit("OFF", "OFF");
  })

  socket.on("disconnect", function () {
    console.log("user disconnected.")
  });
});

http.listen(80, function () {
  console.log("listening on port:80.");
});