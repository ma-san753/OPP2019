main();

async function main() {
    var head = document.getElementById("head");
    var i2cAccess = await navigator.requestI2CAccess();
    var port = i2cAccess.ports.get(1);
    var pca9685 = new PCA9685(port, 0x40);
    const angleDic = [170, 10];
    var onFlag = 0; // 0:OFF, 1:ON
    await pca9685.init(0.0005, 0.0024, 180);
    const socket = io("http://a69da83c.ngrok.io");

    var clientFlag = 1;
    if( clientFlag ){
	socket.on("ON", async function(val){
	    console.log("ON");
	    head.innerHTML = "ON";
	    if( onFlag == 0 ){
		onFlag = 1;
		await pca9685.setServo(0, angleDic[0]);
		await sleep(400);
		await pca9685.setServo(0, angleDic[1]);
	    }
	});
	socket.on("OFF", async function(val){
	    console.log("OFF");	    
	    head.innerHTML = "OFF";  
	    if( onFlag == 1 ){
		onFlag = 0;
		await pca9685.setServo(0, angleDic[0]);
		await sleep(400);
		await pca9685.setServo(0, angleDic[1]);
	    }
	});
    }else{
	for (;;) {
	    await pca9685.setServo(0, angleDic[0]);
	    await sleep(400);
	    await pca9685.setServo(0, angleDic[1]);
	    await sleep(2000);
	}
    }
}
