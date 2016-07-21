var fs = require('fs'),
	request = require('request');

function cachePokemon() {
	request('http://pokeapi.co/api/v2/pokemon?limit=151', function (error, response, body) {

		if (!error && response.statusCode == 200) {
			var body = JSON.parse(body),
				pokemon = body.results,
				results = [];

			for(var i = 0; i < pokemon.length; i++) {
				results.push({
					id: i+1,
					name: pokemon[i].name.replace('-f','♀').replace('-m','♂'),
					sprite: 'http://pokeapi.co/media/sprites/pokemon/' + (i + 1) + '.png'});
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