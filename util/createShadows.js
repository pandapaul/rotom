var jimp = require('jimp'),
	pokemon = require('../resources/pokemon.json'),
	fileHandler = require('./fileHandler');

function createShadows() {
	var results = [];

	for(var i = 0; i < pokemon.length; i++) {
		var id = i + 1,
			name = pokemon[i].name.replace('-f','♀').replace('-m','♂'),
			src = __dirname+'/../static/sprites/' + id + '.png',
			trgt = __dirname+'/../static/sprites/' + id + '.shadow.png';

		fileHandler.makeShadowCopy(src, trgt);
	}
}

module.exports = createShadows;