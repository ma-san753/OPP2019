var microBitBle;
var bme280_body;

var bme280_outside;
var readEnable;
const server = "https://a69da83c.ngrok.io";
const socket = io(server);

var humidity = 0.0;
async function connect() {
  microBitBle = await microBitBleFactory.connect();
  msg.innerHTML = "micro:bit BLE接続しました。";
  var i2cAccess = await microBitBle.requestI2CAccess();
  var i2cPort = i2cAccess.ports.get(1);
  bme280_body = new BME280(i2cPort, 0x76);
  bme280_outside = new BME280(i2cPort, 0x77);
  await bme280_body.init();
  await bme280_outside.init();
  readEnable = true;
  readData();
}
async function disconnect() {
  readEnable = false;
  await microBitBle.disconnect();
  msg.innerHTML = "micro:bit BLE接続を切断しました。";
}
async function sendStatus(humidity, lon, lat, time) {
  socket.emit("send", { humidity: humidity, longitude: lon, latitude: lat });
  msg.innerHTML = "送ったで";
}
async function getposCB(position) {
  console.log(
    "lat: ",
    position.coords.latitude,
    " lon: ",
    position.coords.longitude
  );
  sendStatus(humidity, position.coords.longitude, position.coords.latitude);
}
async function readData() {
  var valBody;
  var humidityBody = 50.0;
  var valOutside;
  var humidityOutside = 50.0;
  var discomfort = 0.0;
  var alpha = 0.9;
  var beta = 1;
  const SUM_TRESHOLD = 70;
  const DIFF_TRESHOLD = 15;
  const MAX_DISCOM = 100;
  let counter = 0;
  while (readEnable) {
    try {
      valBody = await bme280_body.readData();
      valOutside = await bme280_outside.readData();
    } catch (error) {
      console.error(error);
    }

    msg.innerHTML =
      valBody.temperature +
      "℃ " +
      valBody.pressure +
      "hPa " +
      valBody.humidity +
      "%";
    //console.log('readVal:', readVal);
    humidityBody = valBody.humidity;
    humidityOutside = valOutside.humidity;
    console.log("out: ", humidityOutside, " body: ", humidityBody);
    humidity = humidityBody;
    var tmp = humidityBody - humidityOutside;
    tmp = tmp >= DIFF_TRESHOLD ? tmp : 0;
    discomfort = discomfort * alpha + tmp * beta;
    if (discomfort > MAX_DISCOM) discomfort = MAX_DISCOM;
    if (discomfort >= SUM_TRESHOLD) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getposCB);
      }
      console.log("discomfort!!");
    }

    console.log("loop count: ", counter++);
    await sleep(2000);
  }
  console.log("fin");
}
