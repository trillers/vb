var BrokerFactory = require('../../index');
var rabbitmq = require('base-settings').rabbitmq;
var assert = require('chai').assert;
var url = 'amqp://' +rabbitmq.username + ':' + rabbitmq.password + '@' + rabbitmq.host + ':' + rabbitmq.port + '/' + rabbitmq.vhost;
var open = require('amqplib').connect(url);

describe('agent broker test', function(){
    var brokerPromise = BrokerFactory.create(open, {bot: true, nm: true, agent: true});

    it('agent heartbeat', function(done){
        brokerPromise.then(function(broker){
            var agentBroker = broker.getAgent();
            var nodeManagerBroker = broker.getNodeManager();
            nodeManagerBroker.onAgentHeartbeat(function(err, beatInfo){
                console.log(beatInfo);
            })
            agentBroker.heartbeat({info: 'i am a agent heartbeat'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    });

    it('agent status change', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var agentBroker = broker.getAgent();
            var nodeManagerBroker = broker.getNodeManager();
            botBroker.onAgentStatusChange(function(err, changeInfo){
                console.log(changeInfo);
            })
            nodeManagerBroker.onAgentStatusChange(function(err, changeInfo){
                console.log(changeInfo);
            })
            agentBroker.agentStatusChange({info: 'i am a agent status change to node manager'});
            agentBroker.botStatusChange({info: 'i am a agent status change to bot'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    });

    it('agent action to bot', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var agentBroker = broker.getAgent();
            botBroker.onActionIn(function(err, action){
                console.log(action);
            })

            agentBroker.actionIn({info: 'i am a agent action'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    });

    it('agent action feedback to bot', function(done){
        brokerPromise.then(function(broker){
            var botBroker = broker.getBot();
            var agentBroker = broker.getAgent();
            botBroker.onActionFeedback(function(err, feedback){
                console.log(feedback);
            })

            agentBroker.actionFeedback({info: 'i am a agent action feedback'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    });
})



