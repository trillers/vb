var vc = require('vc');
var CONST = require('vc').enum;
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
        vc.create(open, {bot:true}).then(function(broker){
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
            console.log(data)
            me.broker.command(data);
        });
        //TODO get message - action in from va
        me.broker.onActionIn(function(err, data){
            console.log("***************");
            console.log(data)
            //send it to vk
            if(err){
                console.error(err);
                return;
            }
            me.broker.clientActionIn(data, data.AgentId);
        });
        //TODO receive a action from vk  - enqueue
        me.broker.onClientAction(function(err, data){
            console.error("receive a client action***********")
            var prefix = data.Action.split('-')[0],
                type = data.Action.split('-')[1],
                to = data.Action.split('-')[2];
            console.log("prefix--------" + prefix);
            console.log("type----------" + type);
            console.log("to------------" + to);
            if(prefix === 'broadcast'){
                handleMultiActions(data, type, to)
            }else{
                console.log('this is a single message');
                data.Action = prefix + '-' + type;
                console.log(data);
                me.broker.actionOut(data, data.AgentId);
            }
        });

        me.broker.onCommandFeedback(function(err, data){
            console.log('receive a cmd feedback***********')
            console.error(data);
            if(data.Command === CONST.NODE.COMMAND.START && data.Code === 200){
                me.broker.getActionOutMsgCount(data.AgentId).then(function(count){
                    if(count <= 0){
                        me.broker.actionOut({
                            Action: 'polling-list',
                            CreateTime: (new Date()).getTime(),
                            AgentId: data.AgentId
                        }, data.AgentId)
                    }
                })
            }
        });

        //TODO receive a message which task completely from agent  - dequeue if null, walk dom
        me.broker.onActionFeedback(function(err, data){
            console.log("receive a action feedback*************");
            console.error(data);
            me.broker.getActionOutMsgCount(data.AgentId).then(function(count){
                if(count <= 0){
                    setTimeout(function(){
                        me.broker.actionOut({
                            Action: 'polling-list',
                            CreateTime: (new Date()).getTime(),
                            AgentId: data.AgentId
                        }, data.AgentId)
                    }, 2000);
                }
            })
        });

        function handleMultiActions(data, type, to){
            var listField = null;
            listField = to === 'contacts' ? 'BuIdArr' : 'GroupArr';

            data[listField].forEach(function(item){
                var json = util.deepClone(data);
                util.objExclude(json, listField);
                json.Action = 'send-' + type;
                json['BuId'] = item;
                console.log(json)
                me.broker.actionOut(json, json.AgentId)
            });
        }
    }
};

