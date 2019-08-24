const socket = io();

function onButtonClicked() {

}

socket.on("move", function(message) {
  console.log(message);
})