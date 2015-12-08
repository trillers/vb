var BrokerFactory = require('../../index');
var rabbitmq = require('base-settings').rabbitmq;
var assert = require('chai').assert;
var url = 'amqp://' +rabbitmq.username + ':' + rabbitmq.password + '@' + rabbitmq.host + ':' + rabbitmq.port + '/' + rabbitmq.vhost;
var open = require('amqplib').connect(url);

describe('bot broker test', function(){
    var brokerPromise = BrokerFactory.create(open, {bot: true, nm: true, agent: true});

    it('send command to node manager', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var nodeManagerBroker = broker.getNodeManager();
            nodeManagerBroker.onCommand(function(err, command){
                console.log(command);
            })
            botBroker.command({info: 'i am a bot command'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    })

    it('send action to agent', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var agentBroker = broker.getAgent();
            agentBroker.init('a1');
            agentBroker.init('a2');
            agentBroker.onActionOut(function(err, action, msg){
                console.log(action);
                agentBroker.finish(msg);
            }, 'a1');
            agentBroker.onActionOut(function(err, action, msg){
                console.log(action);
                agentBroker.finish(msg);
            }, 'a2');
            botBroker.actionOut({info: 'i am a agent action to a1 '}, 'a1');
            botBroker.actionOut({info: 'i am a agent action to a2 '}, 'a2');

            setTimeout(function(){
                done();
            }, 1000);
        });
    })

    it('get the msg count of action out queue', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var q = botBroker.getActionOutMsgCount('test');
            q.then(function(count){
                console.log(count);
                assert.ok(count >= 0);
                done();
            })
        });
    })

})




