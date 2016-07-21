var jimp = require('jimp'),
	pokemon = require('../resources/pokemon.json');

function createShadows() {
	var results = [];

	for(var i = 0; i < pokemon.length; i++) {
		var id = i + 1,
			name = pokemon[i].name.replace('-f','♀').replace('-m','♂'),
			src = __dirname+'/../static/sprites/' + id + '.png',
			trgt = __dirname+'/../static/sprites/' + id + '.shadow.png';

		saveAndModifyImage(name, src, trgt);
	}
}

function saveAndModifyImage(name, src, trgt) {
	jimp.read(src, function (err, image) {
		if(image) {
			image.brightness(-1);
			image.write(trgt);
			console.log(name + ' shadow sprite saved to: ' + trgt)
		}
	});	
}

module.exports = createShadows;