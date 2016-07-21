var express = require('express'),
	fuse = require('fuse.js'),
	pokemon = require('../resources/pokemon.json'),
	getRandomInt = require('../util/getRandomInt'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	var input = req && req.query && req.query.text && req.query.text.toLowerCase(),
		target;

	if(process.env.CHANNEL_ID && req.query.channel_id !== process.env.CHANNEL_ID) {
		res.json({
			response_type: 'ephemeral',
			text: 'Let\'s keep this stuff where it belongs.'
		});
		return;
	}

	if(!input || input === '') {
		res.json({
			response_type: 'ephemeral',
			text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
		});
		return;
	}

	if(input === 'game') {
		var id = getRandomInt(1,pokemon.length);

		res.json({
    		response_type: 'in_channel',
		    attachments: [
		        {	
		        	text:'',
		            image_url: 'http://rotom.herokuapp.com/sprites/' + id + '.shadow.png'
		        },{	
		        	mrkdwn_in: ['text'],
		        	text: 'Who\'s That Pokemon?',
		        }
		    ]
		});		
		res.json()
		return;
	}

	target = pokemon.find(function (poke) {
		return poke.name === input;
	});

	if(!target) {
		var f = new fuse(pokemon, {keys: ['name']}),
			matches = f.search(input);

		if(matches && matches.length > 0) {
			target = matches[0];
		}
	}

	if (target) {
		res.json({
    		response_type: 'in_channel',
		    attachments: [
		        {	
		        	text:"",
		            image_url: 'http://rotom.herokuapp.com/sprites/' + target.id + '.png'
		        },{	
		        	mrkdwn_in: ["text"],
		        	text: 'A wild *' + target.name.toUpperCase() + '* appeared!',
		        }
		    ]
		});
		return;
	}

	res.json({
		'response_type': 'in_channel',
		'text': 'Someone thought they saw a *' + input.toUpperCase() + '*, but I\'m not sure what that is.'
	});
});

module.exports = router;