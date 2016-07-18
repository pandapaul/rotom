var express = require('express'),
	request = require('request'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	var pokemon = req && req.query && req.query.text && req.query.text.toLowerCase(),
		url = 'http://pokeapi.co/api/v2/pokemon/' + pokemon;
		
	if(!pokemon || pokemon === '') {
		res.json({
			response_type: 'ephemeral',
			text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
		});
		return;
	}

	request(url, function (error, response, body) {
		var slackMessage;

		if (!error && response.statusCode == 200) {
			var body = JSON.parse(response.body);
			slackMessage = {
	    		response_type: 'in_channel',
			    attachments: [
			        {	
			        	text:"",
			            image_url: body.sprites.front_default
			        },{	
			        	mrkdwn_in: ["text"],
			        	text: 'A wild *' + body.name.toUpperCase() + '* appeared!',
			        }
			    ]
			};
		} else {
			slackMessage = {
				'response_type': 'in_channel',
				'text': 'Someone thought they saw a *' + pokemon.toUpperCase() + '*, but I\'m not sure what that is.'
			};
		}
	    res.json(slackMessage);
	});

});

module.exports = router;