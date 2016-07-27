var token = process.env.SLACK_API_TOKEN || '';

var Botkit = require('botkit');
var rotom = require('../util/rotom');
var controller = Botkit.slackbot();
var bot = controller.spawn({
  token: token
});

bot.startRTM(function(err,bot,payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  }
});


controller.hears(['(.*)'], 'direct_message,direct_mention,mention', function(bot, message) {
	var inputString = message && message.match && message.match[0];

    bot.reply(message, rotom.slashCommand(inputString));
});