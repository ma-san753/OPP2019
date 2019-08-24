const socket  = io();

function onButtonClicked() {
  console.log("Clicked.");
  socket.emit("send", "send");
}

console.log("test");