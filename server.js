var express = require('express'),
	router = express.Router(),
	api = require('./api/index'),
	app = express();

routes();
listen();

function routes() {
	app.use('/', api);
}

function listen() {
	var listenPort = process.env.PORT || 3000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}