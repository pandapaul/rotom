require('./bot/index');

var express = require('express'),
	router = express.Router(),
	api = require('./api/index'),
	app = express();

routes();
listen();

function routes() {
	app.use(express.static('static'));
	app.use('/api/slack/', api.slack.router);
	app.use('/api/admin/', api.admin);
}

function listen() {
	var listenPort = process.env.PORT || 3000;
	app.listen(listenPort);
	console.log('Listening on port ' + listenPort);
}