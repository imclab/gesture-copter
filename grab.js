var fs = require("fs");
var arDrone = require('ar-drone');
var client  = arDrone.createClient();
client.config('general:navdata_demo', 'FALSE');

var i = 0;
var last = 0;
var pngStream = client.createPngStream();
pngStream.on('data', function (data) {
  if (last + 1000 < Date.now()) {
    fs.writeFile("/home/tim/grab/grab-" + (i++) + ".png", data);
    last = Date.now();
  }
});
