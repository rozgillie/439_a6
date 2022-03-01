var serial; // variable to hold an instance of the serialport library
var portName = "/dev/cu.usbmodem14401" //rename to the name of your port
var datain; //some data coming in over serial!

function setup() {
  serial = new p5.SerialPort();       // make a new instance of the serialport library
  serial.on('list', printList);       // set a callback function for the serialport list event
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen);        // callback for the port opening
  serial.on('data', serialEvent);     // callback for when new data arrives
  serial.on('error', serialError);    // callback for errors
  serial.on('close', portClose);      // callback for the port closing
  serial.list();                      // list the serial ports
  serial.open(portName);              // open a serial port
  createCanvas(1200, 800);
  background(0x08, 0x16, 0x40);
}
 
//
//pulled from class example

//writes what key is pressed
function keyPressed() {
	//console.log(key);
  serial.write(key); // write key code to serial for arduino to read
}

// get the list of ports:
function printList(portList) {
 // portList is an array of serial port names
 for (var i = 0; i < portList.length; i++) {
 // Display the list the console:
   print(i + " " + portList[i]);
 }
}

function serverConnected() {
  print('connected to server.');
}
 
function portOpen() {
  print('the serial port opened.')
}
 
function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
 
function portClose() {
  print('The serial port closed.');
}

// pulled from slides
function serialEvent() {
  if (serial.available()) { //if there is serial to be read
	var datastring = serial.readLine(); // readin some serial
	var newarray; //create new array
	try {
      newarray = JSON.parse(datastring); // can we parse the serial
      print(newarray);
  	} catch(err) { //print error if array is not made
      	  console.log(err);
	}
	if (typeof(newarray) == 'object') { 
  	  dataarray = newarray; // set new array to be data array
	}
	console.log("got back " + datastring); //prints to console the data
  }
}


function draw() {
  background(0); //set background to black
  if (dataarray[1] == 1) { //if button is pressed
      text("button pressed: YES", 30,30);
      print("clicked");
  } else { //default button to not being pressed
      text("button pressed: NO", 30,30);
  }
  
  // change background brightness based on potentiometer input
  // code based on https://medium.com/@yyyyyyyuan/tutorial-serial-communication-with-arduino-and-p5-js-cd39b3ac10ce
    var brightness = map(dataarray[0], 0, 255, 0, 255);   // map input to the correct range of brightness
    fill(brightness);   // fill background with brightness corresponding from potentiometer info
  
    // draw the text - left
    var textLColor = map(brightness, 0, 255, 255,0);  // inverse the color for drawing the text on background
    fill(textLColor); //fill color based on background
    textSize(16); //text size 16
    text("BRIGHTNESS LEVEL: " + dataarray[0], 30, 100);    // displaying the input
}