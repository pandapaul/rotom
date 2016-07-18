var express = require('express'),
	request = require('request'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	var name = req && req.query && req.query.text && req.query.text.toLowerCase(),
		url = 'http://pokeapi.co/api/v2/pokemon/' + name;
		
	if(!name || name === '') {
		res.json({
			response_type: 'ephemeral',
			text: 'Type /rotom the_name_of_a_pokémon to report that a pokémon is nearby.'
		});
		return;
	}

	if(req.query.channel !== 'pokemon') {
		res.json({
			response_type: 'ephemeral',
			text: 'Let\'s keep this stuff where it belongs.'
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
				'text': 'Someone thought they saw a *' + name.toUpperCase() + '*, but I\'m not sure what that is.'
			};
		}
	    res.json(slackMessage);
	});

});

module.exports = router;