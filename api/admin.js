var express = require('express'),
	request = require('request'),
	fs = require('fs'),
	jimp = require('jimp'),
	fileHandler = require('../util/fileHandler'),
	randomString = require('../util/randomString');
	createShadows = require('../util/createShadows'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/cache/pokemon', function (req, res) {

	console.log('Begin Pokemon Cache');

	cachePokemon().then(function(resp) {
		console.log('Pokemon Cache Successful');
		res.json({'message': 'Pokemon cached'});
	}).catch(function(err) {
		console.log('Pokemon Cache Failure');
		res.json({'message': 'Cache Failure', 'error': err});
	});
});

function cachePokemon() {
	var promise = new Promise(function(resolve,reject) {

		request('http://pokeapi.co/api/v2/pokemon?limit=721', function (error, response, body) {

			if (error || response.statusCode != 200) {

				reject(error || response);
				return;
			}

			var body = JSON.parse(body),
				pokemon = body.results,
				results = [];

			for(var i = 0; i < pokemon.length; i++) {
				processPokemonInput(i, pokemon[i], results);
			}



			fs.writeFile(__dirname+"/../resources/pokemon.json", JSON.stringify(results), function(err) {
			    if(err) {
			    	reject(err);
			        return;
			    }
			    resolve();
			}); 
		});
	});

	return promise;
}

function processPokemonInput(i, pokemon, results) {
	var id = i + 1,
		name = getName(pokemon.name),
		shadowRandom = randomString(10),
		srcSpriteUrl = 'http://pokeapi.co/media/sprites/pokemon/' + id + '.png',
		spriteFile = __dirname+'/../static/img/sprites/' + id + '.png',
		shadowFile = __dirname+'/../static/img/silhouettes/' + shadowRandom + '.png';

	console.log('Pokemon Processed: ' + id + ' - ' + name)	
	results.push({
		id: id,
		name: name,
		sprite: 'https://rotom.herokuapp.com/img/sprites/' + id + '.png',
		shadow: 'https://rotom.herokuapp.com/img/silhouettes/' + shadowRandom + '.png'
	});
		
	fileHandler.copyFile(srcSpriteUrl, spriteFile).then(function() {
		console.log('Sprite Saved: ' + id + ' - ' + name)	
		fileHandler.makeShadowCopy(spriteFile, shadowFile).then(function() {
			console.log('Shadow Saved: ' + id + ' - ' + name)	
		});
	});
}

function getName(name) {
	return name;
}

module.exports = router;