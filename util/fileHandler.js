var http = require('http'),
  fs = require('fs'),
  jimp = require('jimp');

function copyFile(source, target) {
  var promise = new Promise(function(resolve, reject) {

    var file = fs.createWriteStream(target);
    var request = http.get(source, function(response) {
      response.pipe(file);
      response.on('end', function () {
        resolve();
      });
    });
  });

  return promise;
}

function makeShadowCopy(src, trgt) {
  var promise = new Promise(function(resolve, reject) {
  	jimp.read(src, function (err, image) {
  		if(image) {
  			image.brightness(-1);
  			image.write(trgt);
        resolve();
  		} else {
        reject();
      }
  	});	
  });

  return promise;
}

function base64Encode(src) {
    var bitmap = fs.readFileSync(src);
    return new Buffer(bitmap).toString('base64');
}

module.exports = {
	copyFile: copyFile,
	makeShadowCopy: makeShadowCopy,
	base64Encode: base64Encode
};