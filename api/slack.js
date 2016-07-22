var express = require('express'),
	fuse = require('fuse.js'),
	pokemon = require('../resources/pokemon.json'),
	getRandomInt = require('../util/getRandomInt'),
	fileHandler = require('../util/fileHandler'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	var input = req && req.query && req.query.text && req.query.text.toLowerCase(),
		target;

	function isNotAuthorizedChannel() {
		return !!(process.env.CHANNEL_ID && req.query.channel_id !== process.env.CHANNEL_ID);
	} 

	function sendUnathorizedChannelMessage() {
		res.json({
			response_type: 'ephemeral',
			text: 'Let\'s keep this stuff where it belongs.'
		});		
	}

	function isHelpInput() {
		return !!(!input || input === '');
	} 

	function sendHelpResponse() {
		res.json({
			response_type: 'ephemeral',
			text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
		});
	}

	function isGameInput() {
		return input.toLowerCase() === 'game';
	}

	function sendGameResponse() {
		var id = getRandomInt(1,pokemon.length),
			str;

		str = fileHandler.base64Encode( __dirname+'/../static/sprites/' + id + '.shadow.png');
		res.json({
    		response_type: 'in_channel',
    		text: 'Who\'s that Pokémon?',
		    attachments: [
		        {	
		        	text:'',
		            image_url: 'data:image/png;base64,' + str
		        }
		    ]
		});
	}

	function getExactPokemonMatch() {
		return pokemon.find(function (poke) {
			return poke.name === input;
		});
	}

	function getFuzzyPokemonMatch() {
		var f = new fuse(pokemon, {keys: ['name'], threshold: 0.8}),
			matches = f.search(input);

		if(matches && matches.length > 0) {
			return matches[0];
		}
	}

	function sendPokemonFoundResponse() {
		res.json({
    		response_type: 'in_channel',
		    attachments: [
		        {	
		        	text:"",
		            image_url: 'http://rotom.herokuapp.com/sprites/' + target.id + '.png'
		        },{	
		        	mrkdwn_in: ["text"],
		        	text: 'A wild *' + target.name.toUpperCase() + '* appeared!'
		        }
		    ]
		});
	}

	function sendNoMatchFoundResponse() {
		res.json({
			'response_type': 'in_channel',
			'text': 'Someone thought they saw a *' + input.toUpperCase() + '*, but I\'m not sure what that is.'
		});
	}

	if(isNotAuthorizedChannel()) {
		sendUnathorizedChannelMessage()
		return;
	}

	if(isHelpInput()) {
		sendHelpResponse();
		return;
	}

	if(isGameInput()) {
		sendGameResponse();
		return;
	}

	target = getExactPokemonMatch()

	if(!target) {
		target = getFuzzyPokemonMatch();
	}

	if (target) {
		sendPokemonFoundResponse();
		return;
	}

	sendNoMatchFoundResponse();
});

module.exports = router;