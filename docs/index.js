const server = window.prompt("接続先を入力してください", "localhost")

const socket  = io(server);

const form = document.forms.sendData;

function onButtonClicked() {
  console.log("Clicked.");
  const sendData = {
    humidity: form.humidity.value,
    latitude: form.latitude.value,
    longitude: form.longitude.value
  }
  socket.emit("send", sendData);
}

console.log("test");