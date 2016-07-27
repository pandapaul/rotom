require('../util/extensions');

var express = require('express'),
	fuse = require('fuse.js'),
	pokemon = require('../resources/pokemon.json'),
	getRandomInt = require('../util/getRandomInt'),
	fileHandler = require('../util/fileHandler'),
	rotom = require('../util/rotom'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/', function (req, res) {
	res.json(rotom.slashCommand(req && req.query && req.query.text && req.query.text.toLowerCase()));
});

module.exports = router;