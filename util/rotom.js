require('./extensions');

var fuse = require('fuse.js'),
	pokemon = require('../resources/pokemon.json'),
	getRandomInt = require('./getRandomInt'),
	fileHandler = require('./fileHandler');

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

function sendGameResponse(inputArray) {
	var id = getRandomPokemonId(inputArray);

	return {
		response_type: 'in_channel',
		text: 'Who\'s that Pokémon?',
	    attachments: [
	        {	
	        	text:'',
	            image_url:  pokemon[id].shadow
	        }
	    ]
	};
}

function getRandomPokemonId(inputArray) {
	var min = 1,
		max = pokemon.length;

	if(inputArray[1]) {
		max = inputArray[1];
	}

	if(inputArray[2]) {
		max = inputArray[2];
		min = inputArray[1];
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
		return sendGameResponse(inputArray);
	}

	target = getExactPokemonMatch(input)

	if(!target) {
		target = getFuzzyPokemonMatch(input);
	}

	if (target) {
		return sendPokemonFoundResponse(target);
	}

	return sendNoMatchFoundResponse(input);
}

module.exports = {
	isNotAuthorizedChannel: isNotAuthorizedChannel,
	sendUnathorizedChannelMessage: sendUnathorizedChannelMessage,
	isHelpInput:isHelpInput,
	sendHelpResponse: sendHelpResponse,
	isGameInput:isGameInput, 
	sendGameResponse: sendGameResponse,
	getExactPokemonMatch:getExactPokemonMatch,
	getFuzzyPokemonMatch:getFuzzyPokemonMatch,
	sendPokemonFoundResponse: sendPokemonFoundResponse,
	sendNoMatchFoundResponse: sendNoMatchFoundResponse,
	slashCommand: slashCommand
};