var express = require('express'),
	router = express.Router(),
	request = require('request'),
	app = express();

routes();
listen();

function routes() {
	app.get('/', function (req, res) {
		var pokemon = req && req.query && req.query.text && req.query.text.toLowerCase(),
			url = 'http://pokeapi.co/api/v2/pokemon/' + pokemon,
			defaultErrorMessage = {
				'response_type': 'ephemeral',
				'text': 'Sorry, ' + pokemon + ' is not a pokémon.'	
			}

		if(!pokemon || pokemon === '') {
			res.json(defaultErrorMessage);
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
				slackMessage = defaultErrorMessage;
			}
		    res.json(slackMessage);
		});

	});
}

function listen() {
	var listenPort = process.env.PORT || 3000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}