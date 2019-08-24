const server = window.prompt("接続先を入力してください", "localhost");

const socket  = io(server);

function onButtonClicked() {

}

socket.on("move", function(message) {
  console.log(message);
})