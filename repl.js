var fs = require("fs");
var brain = require("brain");
var Canvas = require('canvas');
var arDrone = require('ar-drone');
var hog = require("hog-descriptor");

var IMG_WIDTH = 640;
var IMG_HEIGHT = 360;
var PATCH_SIZE = 40;

var net = new brain.NeuralNetwork();
var data = fs.readFileSync("net.json");
net.fromJSON(JSON.parse(data));

var client  = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');

function check(img) {
  var width = img.width;
  var height = img.height;
  var aspect = width / height;

  while (width >= 40 && height >= 40) {
    var canvas = new Canvas(width, height);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    width -= 40;
    height = width / aspect;

    checkCanvas(canvas);
  }
}

function checkCanvas(canvas) {
  for (var y = 0; (y + PATCH_SIZE) <= canvas.height;) {
    for (var x = 0; (x + PATCH_SIZE) <= canvas.width; x += 10) {
      var canvas2 = new Canvas(PATCH_SIZE, PATCH_SIZE);
      var ctx = canvas2.getContext('2d');
      ctx.drawImage(canvas, 0, 0, PATCH_SIZE, PATCH_SIZE, x, y, PATCH_SIZE, PATCH_SIZE);

      var descriptor = hog.extractHOG(canvas2, {
        cellSize: 6,
        blockSize: 2,
        blockStride: 1,
        bins: 6,
        norm: "L2"
      });

      var output = net.run(descriptor);
      if (output > 0.5) {
        console.log(output);
      }
    }

    if (y + PATCH_SIZE == canvas.height) {
      break;
    } else if (y + 10 + PATCH_SIZE > canvas.height) {
      y = canvas.height - PATCH_SIZE;
    } else {
      y += 10;
    }
  }
}


client.createRepl();
