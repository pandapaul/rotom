var express = require('express'),
	fuse = require('fuse.js'),
	pokemon = require('../static/resources/pokemon.json'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	var name = req && req.query && req.query.text && req.query.text.toLowerCase(),
		target;

	if(process.env.CHANNEL_ID && req.query.channel_id !== process.env.CHANNEL_ID) {
		res.json({
			response_type: 'ephemeral',
			text: 'Let\'s keep this stuff where it belongs.'
		});
		return;
	}

	if(!name || name === '') {
		res.json({
			response_type: 'ephemeral',
			text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
		});
		return;
	}

	target = pokemon.find(function (poke) {
		return poke.name === name;
	});

	if(!target) {
		var f = new fuse(pokemon, {keys: ['name']}),
			matches = f.search(name);

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
		            image_url: target.sprite
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
		'text': 'Someone thought they saw a *' + name.toUpperCase() + '*, but I\'m not sure what that is.'
	});
});

module.exports = router;