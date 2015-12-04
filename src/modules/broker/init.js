var brokerFactory = require('vc');
var settings = require('base-settings');
var amqp = require('amqplib');
var rbqUri = 'amqp://' + settings.rabbitmq.username + ':' + settings.rabbitmq.password + '@' + settings.rabbitmq.host + ':' + settings.rabbitmq.port + '/' + settings.rabbitmq.vhost;
var open = amqp.connect(rbqUri);

exports.create = function(bot, done){
    return brokerFactory.create(open, {nm: true, bot:true, agent: true}).then(function(broker){
        bot.broker =  {
            nm: broker.getNodeManager(),
            bot: broker.getBot(),
            agent: broker.getAgent()
        };
        bot.start(done);
    })
};
exports.bindEvents = function(bot, done){
    //TODO
};