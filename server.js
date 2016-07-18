var express = require("express"),
	router = express.Router(),
	app = express();

routes();
listen();

function routes() {
	app.get('/', function (req, res) {
	    res.json({test:'test'});
	});
}

function listen() {
	var listenPort = process.env.PORT || 3000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}