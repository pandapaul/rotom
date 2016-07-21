var http = require('http'),
  fs = require('fs');

function copyFile(source, target, cb) {
  var file = fs.createWriteStream(target);
  var request = http.get(source, function(response) {
    response.pipe(file);
    if(cb) {
      cb()
    };
  });
}

module.exports = copyFile;