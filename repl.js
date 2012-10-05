var Canvas = require('canvas');
var arDrone = require('ar-drone');
var hog = require("hog-descriptor");

var IMG_WIDTH = 640;
var IMG_HEIGHT = 360;

var client  = arDrone.createClient();
client.takeoff();
client.config('general:navdata_demo', 'FALSE');

var pngStream = client.createPngStream();
pngStream.on('data', function (data) {
  var img = new Canvas.Image;
  img.src = data;

  var canvas = new Canvas(IMG_WIDTH, IMG_HEIGHT);
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0, IMG_WIDTH, IMG_HEIGHT);

  /*var descriptor = hog.extractHOG(canvas);
  console.log(descriptor); // [0.455, 0.003, 0.987, ...]*/

  canvas.toDataURL('image/png', function (err, str) {
    console.log(str + "\n\n");
  });
});

client.createRepl();
