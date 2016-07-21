var fs = require('fs'),
	request = require('request'),
	copyFile = require('./copyFile');

function cachePokemon() {
	request('http://pokeapi.co/api/v2/pokemon?limit=10000', function (error, response, body) {

		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body),
				pokemon = body.results,
				results = [];

			for(var i = 0; i < pokemon.length; i++) {
				var id = i + 1,
					srcSpriteUrl = 'http://pokeapi.co/media/sprites/pokemon/' + id + '.png',
					targetSpriteUrl = __dirname+'/../static/sprites/' + id + '.png';

				results.push({
					id: id,
					name: pokemon[i].name.replace('-f','♀').replace('-m','♂')
				});
					
				copyFile(srcSpriteUrl, targetSpriteUrl);			
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