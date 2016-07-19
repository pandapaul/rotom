var express = require('express'),
	request = require('request'),
	cachePokemon = require('../util/cachePokemon'),
	router = express.Router({
    	mergeParams: true
	});

router.get('/cache/pokemon', function (req, res) {
	cachePokemon();
	res.json({'message': 'Pokemon cached'});
});

module.exports = router;