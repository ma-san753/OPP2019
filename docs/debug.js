const server = window.prompt("接続先を入力してください", "localhost")

const socket  = io(server);

const sendForm = document.forms.sendData;

function onButtonClicked() {
  console.log("Clicked.");
  console.log(sendForm);
  const sendData = {
    humidity: sendForm.humidity.value,
    latitude: sendForm.latitude.value,
    longitude: sendForm.longitude.value
  }
  console.log(sendData);
  socket.emit("send", sendData);
}

function sendON() {
  socket.emit("sendON","sendON");
}

function sendOFF() {
  socket.emit("sendOFF","sendOFF");
}


console.log("test");