var express = require("express"),
	router = express.Router(),
	app = express();

routes();
listen();

function routes() {
	app.get('/', function (req, res) {

		var response = {
		    "response_type": "in_channel",
		    "text": "*Grass rustles* It's a friggin' Evee!"
		}

	    res.json(response);
	});
}

function listen() {
	var listenPort = process.env.PORT || 3000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}