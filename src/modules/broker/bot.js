var brokerFactory = require('vc');
var settings = require('base-settings');
var amqp = require('amqplib');
var rbqUri = 'amqp://' + settings.rabbitmq.username + ':' + settings.rabbitmq.password + '@' + settings.rabbitmq.host + ':' + settings.rabbitmq.port + '/' + settings.rabbitmq.vhost;
var open = amqp.connect(rbqUri);
var util = require('./util');

var bot = module.exports = {
    //message broker
    broker: null,

    //create broker
    init: function(done){
        brokerFactory.create(open, {bot:true}).then(function(broker){
            bot.broker = broker.getBot();
            bot.bind();
            done();
        })
    },

    //event binding
    bind: function(){
        var me = this;
        //forward command to vn
        me.broker.onClientCommand(function(err, data){
            me.broker.command(data);
        });
        //TODO get message - action in from va
        me.broker.onActionIn(function(err, data){
            //send it to vk
            me.broker.
        });
        //TODO receive a action from vk  - enqueue
        me.broker.onClientAction(function(err, data){
            var prefix = data.Action.split('-')[0],
                type = data.Action.split('-')[1],
                to = data.Action.split('-')[2];

            if(prefix === 'broadcast'){
                handleMultiActions(data, type, to)
            }else{
                me.broker.actionOut(data, data.AgentId);
            }
        });
        //TODO receive a message which task completely from agent  - dequeue if null, walk dom
        me.broker.onActionFeedback(function(err, data){
            me.broker.getActionOutMsgCount(data.AgentId).then(function(count){
                if(count <= 0){
                    me.broker.actionOut({
                        Action: 'polling-list',
                        CreateTime: (new Date()).getTime(),
                        AgentId: data.AgentId
                    }, data.AgentId)
                }
            })
        });

        function handleMultiActions(data, type, to){
            var listField = null,
                toField = null;

            listField = to === 'contact' ? 'BuIdArr' : 'GroupArr';
            toField = to === 'contact' ? 'BuId' : 'Group';

            data[listField].forEach(function(item){
                var json = util.deepClone(data);
                util.objExclude(json, listField);
                json.Action = 'send-' + type;
                json[toField] = item;
                me.broker.actionOut(json, json.AgentId)
            });
        }
    }
};

