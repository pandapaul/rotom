require('../util/extensions');

var express = require('express'),
	fuse = require('fuse.js'),
	pokemon = require('../resources/pokemon.json'),
	getRandomInt = require('../util/getRandomInt'),
	fileHandler = require('../util/fileHandler'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	res.json(slashCommand(req && req.query && req.query.text && req.query.text.toLowerCase()));
});

function isNotAuthorizedChannel() {
	return !!(process.env.CHANNEL_ID && req.query.channel_id !== process.env.CHANNEL_ID);
} 

function sendUnathorizedChannelMessage() {
	return {
		response_type: 'ephemeral',
		text: 'Let\'s keep this stuff where it belongs.'
	};
}

function isHelpInput(input) {
	return !!(!input || input === '');
} 

function sendHelpResponse() {
	return {
		response_type: 'ephemeral',
		text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
	};
}

function isGameInput(input) {
	return input.toLowerCase() === 'game';
}

function sendGameResponse(var1, var2) {
	var pokemon = getRandomPokemon(var1, var2);

	return {
		response_type: 'in_channel',
		text: 'Who\'s that Pokémon?',
		pokemon: pokemon,
	    attachments: [
	        {	
	        	text:'',
	            image_url:  pokemon.shadow
	        }
	    ]
	};
}

function getRandomPokemon(var1, var2) {
	return pokemon[getRandomPokemonId(var1, var2)]
}

function getRandomPokemonId(var1, var2) {
	var min = 1,
		max = pokemon.length;

	if(var1) {
		max = var1;
	}

	if(var2) {
		max = var2;
		min = var1;
	}

	return getRandomInt(parseInt(min)-1,parseInt(max)-1);
}

function getExactPokemonMatch(input) {
	return pokemon.find(function (poke) {
		return poke.name === input;
	});
}

function getFuzzyPokemonMatch(input) {
	var f = new fuse(pokemon, {keys: ['name'], threshold: 0.8}),
		matches = f.search(input);

	if(matches && matches.length > 0) {
		return matches[0];
	}
}

function sendPokemonFoundResponse(target) {
	return {
		response_type: 'in_channel',
		pokemon: target,
	    attachments: [
	        {	
	        	text:"",
	            image_url: target.sprite
	        },{	
	        	mrkdwn_in: ["text"],
	        	text: 'A wild *' + target.name.toUpperCase() + '* appeared!'
	        }
	    ]
	};
}

function sendNoMatchFoundResponse(input) {
	return {
		'response_type': 'in_channel',
		'text': 'Someone thought they saw a *' + input.toUpperCase() + '*, but I\'m not sure what that is.'
	};
}

function getPokemonMatch(input) {
	var target = getExactPokemonMatch(input);

	if(!target) {
		target = getFuzzyPokemonMatch(input);
	}

	return target;
}

function identifyPokemon(input) {
	var target = getPokemonMatch(input);

	if (target) {
		return sendPokemonFoundResponse(target);
	}

	return sendNoMatchFoundResponse(input);
}

function getGameCorrectAnswer(name) {
	var target = getPokemonMatch(name);

	return sendGameCorrectAnswer(target);
}

function sendGameCorrectAnswer(target) {
	return {
		response_type: 'in_channel',
		text: 'It\'s *' + target.name.toUpperCase() + '*!', 
	    attachments: [
	        {	
	        	text:"",
	            image_url: target.sprite
	        }
	    ]
	};
}

function slashCommand(inputString) {
	var inputArray = inputString && inputString.split(' ').clean(''),
		input = inputArray && inputArray[0],
		target;

	if(isNotAuthorizedChannel()) {
		return sendUnathorizedChannelMessage();
	}

	if(isHelpInput(input)) {
		return sendHelpResponse();
	}

	if(isGameInput(input)) {
		return sendGameResponse(inputArray[1],inputArray[2]);
	}

	return identifyPokemon(input);
}

module.exports = {
	router: router,
	isNotAuthorizedChannel: isNotAuthorizedChannel,
	sendUnathorizedChannelMessage: sendUnathorizedChannelMessage,
	isHelpInput:isHelpInput,
	sendHelpResponse: sendHelpResponse,
	isGameInput:isGameInput, 
	sendGameResponse: sendGameResponse,
	getPokemonMatch: getPokemonMatch,
	getExactPokemonMatch:getExactPokemonMatch,
	getFuzzyPokemonMatch:getFuzzyPokemonMatch,
	sendPokemonFoundResponse: sendPokemonFoundResponse,
	sendNoMatchFoundResponse: sendNoMatchFoundResponse,
	slashCommand: slashCommand,
	identifyPokemon: identifyPokemon,
	getGameCorrectAnswer: getGameCorrectAnswer,
	getRandomPokemon: getRandomPokemon
};