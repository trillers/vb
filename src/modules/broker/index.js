var system = require('../../app/system');
var bot = require('./bot');

module.exports = function(){
    system.addMember('bot', bot);
    bot.init(function(){
        system.memberUp(bot);
    });
};