var token = process.env.SLACK_API_TOKEN || '';

var Botkit = require('botkit');
var slack = require('../api/slack');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: token
});

var Game = require('./game.js');

var games = {};

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});

controller.hears(['(.*)'], 'direct_message,direct_mention,mention,ambient', function(bot, message) {
  if(!games[message.channel] || games[message.channel].completed) {
      games[message.channel] = new Game();
      games[message.channel].channel = message.channel;
  }

  games[message.channel].respond(bot, message);
});

/*
controller.hears(['game'], 'direct_message,direct_mention,mention', function(bot, message) {
  bot.startConversation(message,function(err,convo) {
  	var attempts = 0,
      gameResp = slack.sendGameResponse();

    convo.say(gameResp);

    convo.ask('What do you think it is?',function(response,convo) {
      if(response.text.match(/(\bquit\b)|(\bgive up\b)|(\bcancel\b)/ig)) {
        convo.say('Give up?  Okay!');
        convo.say(slack.getGameCorrectAnswer(gameResp.pokemon.name));
        convo.next();
        return;
      }

      var yourGuess = slack.getPokemonMatch(response.text);

      if(gameResp.pokemon.name === yourGuess.name) {
        if(gameResp.pokemon.name.toUpperCase() === response.text.toUpperCase()) {
          convo.say('RIGHT!');
        } else {
          convo.say('CLOSE ENOUGH!');
        }
        convo.say(slack.getGameCorrectAnswer(yourGuess.name));
        convo.next();
      } else {
        attempts += 1;
        convo.say({
          attachments: [{
            author_icon:  gameResp.pokemon.shadow,
            author_name: 'Test',
            text: 'You think it looks like ' + yourGuess.name.toUpperCase() + '?',
            image_url: yourGuess.sprite,
            color: '#ff0000'
          }]
        });
        if(attempts < 3) {
          convo.say('Nope.  Sorry, try again.  You have ' + (3 - attempts) + ' more tries.')
          convo.repeat();
          convo.next();
        } else {
          convo.say('Wrong, sorry.');
          convo.say(slack.getGameCorrectAnswer(gameResp.pokemon.name));
          convo.next();
        }
      }
    });        
  });
});



controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
	var inputString = message && message.match && message.match[0];

    bot.reply(message, slack.slashCommand(inputString));
});
*/