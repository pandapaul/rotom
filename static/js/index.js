require('../less/rotom.less');
var $ = require('jquery');

function build() {
	updateColors();
}

function updateColors() {
	var app = $('.rotom'),
		currentIndex = 0,
		rotomColorClasses = [
			'purple',
			'red',
			'yellow',
			'green',
			'blue'
		];

	function rotomColorChanging() {
		removeRotomClasses();
		addNextClass();
	    setTimeout(rotomColorChanging, 5000);
	}

	function removeRotomClasses() {
		$.each(rotomColorClasses, function(i,val) {
			app.removeClass(val);
		})
	}

	function addNextClass() {
		currentIndex = currentIndex + 1;
		debugger;
		if(currentIndex >= rotomColorClasses.length) {
			currentIndex = 0;
		}

		app.addClass(rotomColorClasses[currentIndex]);
	}


	rotomColorChanging();	
}

build();