const server = window.prompt("接続先を入力してください", "localhost");

const socket  = io(server);

function onButtonClicked() {
  console.log("Clicked.");
  socket.emit("send", "send");
}

console.log("test");