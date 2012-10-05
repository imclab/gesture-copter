var fs = require("fs");
var brain = require("brain");
var Canvas = require('canvas');
var hog = require("hog-descriptor");

var PATCH_SIZE = 40;

var falseDir = "/home/tim/train/false/"
var trainData = [];

function readDirectory(dir, output) {
  var files = fs.readdirSync(dir);

  files.forEach(function (file) {
    var img = new Canvas.Image;
    img.src = fs.readFileSync(dir + file);

    var canvas = new Canvas(PATCH_SIZE, PATCH_SIZE);
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, PATCH_SIZE, PATCH_SIZE);

    var descriptor = hog.extractHOG(canvas, {
      cellSize: 5,
      blockSize: 2,
      blockStride: 1,
      bins: 6,
      norm: "L2"
    });

    trainData.push({
      input: descriptor,
      output: [output]
    });
  });
}

readDirectory("/home/tim/train/false/", 0);
readDirectory("/home/tim/train/true/", 1);

var net = new brain.NeuralNetwork({
  hiddenLayers: [30]
});

console.log("training...");
net.train(trainData, {
  errorThresh: 0.0004,  // error threshold to reach
  iterations: 20000,   // maximum training iterations
});

console.log("writing...");
fs.writeFile("net.json", JSON.stringify(net.toJSON()));
