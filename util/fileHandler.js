var http = require('http'),
  fs = require('fs'),
  jimp = require('jimp');

function copyFile(source, target, cb) {
  var file = fs.createWriteStream(target);
  var request = http.get(source, function(response) {
    response.pipe(file);
    if(cb) {
      cb()
    };
  });
}

function makeShadowCopy(src, trgt) {
	jimp.read(src, function (err, image) {
		if(image) {
			image.brightness(-1);
			image.write(trgt);
		}
	});	
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