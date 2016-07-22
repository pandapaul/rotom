var fs = require('fs'),
	request = require('request'),
	jimp = require('jimp'),
	fileHandler = require('./fileHandler');

function cachePokemon() {
	request('http://pokeapi.co/api/v2/pokemon?limit=721', function (error, response, body) {

		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body),
				pokemon = body.results,
				results = [];

			for(var i = 0; i < pokemon.length; i++) {
				var id = i + 1,
					name = pokemon[i].name.replace('-f','♀').replace('-m','♂'),
					srcSpriteUrl = 'http://pokeapi.co/media/sprites/pokemon/' + id + '.png',
					targetSpriteUrl = __dirname+'/../static/sprites/' + id + '.png',
					targetSpriteShadowUrl = __dirname+'/../static/sprites/' + id + '.shadow.png';

				results.push({
					id: id,
					name: name
				});
					
				fileHandler.copyFile(srcSpriteUrl, targetSpriteUrl);
			}



			fs.writeFile(__dirname+"/../resources/pokemon.json", JSON.stringify(results), function(err) {
			    if(err) {
			        return console.log(err);
			    }

			    console.log("The file was saved!");
			}); 
		}
	});
}

module.exports = cachePokemon;