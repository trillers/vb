var brokerFactory = require('vc');
var settings = require('base-settings');
var amqp = require('amqplib');
var rbqUri = 'amqp://' + settings.rabbitmq.username + ':' + settings.rabbitmq.password + '@' + settings.rabbitmq.host + ':' + settings.rabbitmq.port + '/' + settings.rabbitmq.vhost;
var open = amqp.connect(rbqUri);

var bot = module.exports = {

    //message broker
    broker: null,

    //create broker
    init: function(done){
        brokerFactory.create(open, {nm: true, bot:true, agent: true}).then(function(broker){
            bot.broker = broker.getNodeManager();
            bot.bind(done);
        })
    },

    //event binding
    bind: function(done){
        console.log(this.broker);
        //TODO bind events

        //TODO receive a message from vk  - enqueue

        //TODO receive a message which task completely from agent  - dequeue if null, walk dom

    }
};

