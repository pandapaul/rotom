"use strict";
let slack = require('../api/slack');

let Game = function(channel) {
	this.channel = '';
	this.answer = slack.getRandomPokemon(),
	this.fallback = {
		events: ['direct_message','direct_mention','mention'],
		response: function(bot, message, answer) {
			bot.reply(message, slack.slashCommand(message.text));
		}
	};
	this.questions = [
		{
			events: ['direct_message','direct_mention','mention'],
			pattern: /game/i,
			response: function(bot, message, answer) {
				bot.reply(message, {
					text: 'Who\'s that Pokémon?',
				    attachments: [
				        {	
				        	text:'',
				            image_url:  answer.shadow
				        }
				    ]
				});
				this.completed = true;
			},
			completed: false
		},{
			events: ['direct_message','direct_mention','mention', 'ambient'],
			maxAttempts: 3,
			attempts: 0,
			response: function(bot, message, answer) {
				let guess = slack.getPokemonMatch(message.text);
				if(guess.name === answer.name) {
			        if(answer.name.toUpperCase() === message.text.toUpperCase()) {
			          bot.reply(message, 'RIGHT!');
			        } else {
			          bot.reply(message,'CLOSE ENOUGH!');
			        }
			        setTimeout(() => bot.reply(message, slack.getGameCorrectAnswer(guess.name)),1000);
			        this.completed = true;
				} else {
			        this.attempts += 1;
			        bot.reply(message,{
			          attachments: [{
			            author_icon:  answer.shadow,
			            author_name: 'Who\'s That Pokemon?',
			            text: 'You think it looks like ' + guess.name.toUpperCase() + '?',
			            image_url: guess.sprite,
			            color: '#ff0000'
			          }]
			        });
			        if(this.attempts < 3) {
			          setTimeout(() => bot.reply(message,'Nope.  Sorry, try again.  You have ' + (3 - this.attempts) + ' more tries.'),1000);
			        } else {
			          setTimeout(() => bot.reply(message,'Wrong, sorry.'),1000);
			          setTimeout(() => bot.reply(message, slack.getGameCorrectAnswer(answer.name)),2000);
			          this.completed = true;
			        }					
				}
			},
			completed: false,
			final: true
		}
	];
	this.log = function() {
		console.log('Logging', this.channel);
	};
	this.forfeit = {
		pattern: /(\bquit\b)|(\bgive up\b)|(\bcancel\b)/ig,
		response: function(bot, message, answer) {
			bot.reply(message,'Give up?  Okay!');
       		bot.reply(message,slack.getGameCorrectAnswer(answer.name));
		}

	}
	this.getQuestion = function(num) {
		return this.questions[num];
	};
	this.getNextQuestion = function(num) {
		num = num || 0;
		let question = this.getQuestion(num);
		if(!question) {
			this.completed = true;
			return;
		}

		if(question.completed) {
			return this.getNextQuestion(num + 1);
		} 

		return question;
	};
	this.respond = function(bot, message) {
		if(this.started && message.text.match(this.forfeit.pattern)) {
			this.forfeit.response(bot,message, this.answer);
			this.completed = true;
			return;
		}

		let question = this.getNextQuestion();

		if(question && question.events.indexOf(message.event) !== -1) {
			if(message.text.match(question.pattern)) {
				console.log(this.answer);
				this.started = true;
				question.response(bot, message, this.answer);
				if(question.completed && question.final) {
					this.completed = true;
				}
				return;
			}
		}
		if(this.fallback && this.fallback.events.indexOf(message.event) !== -1) {
			if(message.text.match(this.fallback.pattern)) {
				this.fallback.response(bot,message, this.answer);
			}
		}
	};
}

module.exports = Game;