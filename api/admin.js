var express = require('express'),
	request = require('request'),
	cachePokemon = require('../util/cachePokemon'),
	createShadows = require('../util/createShadows'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/cache/pokemon', function (req, res) {
	cachePokemon();
	res.json({'message': 'Pokemon cached'});
});

router.get('/cache/shadows', function (req, res) {
	createShadows();
	res.json({'message': 'Shadows cached'});
});

module.exports = router;