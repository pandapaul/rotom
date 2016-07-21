var http = require('http'),
  fs = require('fs');

function copyFile(source, target) {
  var file = fs.createWriteStream(target);
  var request = http.get(source, function(response) {
    response.pipe(file);
  });
}

module.exports = copyFile;