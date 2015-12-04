var BrokerFactory = require('../../index');
var rabbitmq = require('base-settings').rabbitmq;
var assert = require('chai').assert;
var url = 'amqp://' +rabbitmq.username + ':' + rabbitmq.password + '@' + rabbitmq.host + ':' + rabbitmq.port + '/' + rabbitmq.vhost;
var open = require('amqplib').connect(url);

describe('agent manager broker test', function(){
    var brokerPromise = BrokerFactory.create(open, {am: true, nm: true});

    it('agent manager heartbeat', function(done){
        brokerPromise.then(function(broker){
            var agentManagerBroker = broker.getAgentManager();
            var nodeManagerBroker = broker.getNodeManager();
            nodeManagerBroker.onAgentManagerHeartbeat(function(err, beatInfo){
                console.log(beatInfo);
            })
            agentManagerBroker.heartbeat({beat: 'i am a agent manager heart beat'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    })

    it('agent manager infoResponse', function(done){
        brokerPromise.then(function(broker){
            var agentManagerBroker = broker.getAgentManager();
            var nodeManagerBroker = broker.getNodeManager();
            nodeManagerBroker.onInfoResponse(function(err, info){
                console.log(info);
            })
            agentManagerBroker.infoResponse({info: 'i am a agent manager info response'});
            setTimeout(function(){
                done();
            }, 1000);
        });
    })

    it('agent manager status change', function(done){
        brokerPromise.then(function(broker){
            var agentManagerBroker = broker.getAgentManager();
            var nodeManagerBroker = broker.getNodeManager();
            nodeManagerBroker.onAgentManagerStatusChange(function(err, info){
                console.log(info);
            })
            agentManagerBroker.statusChange({info: 'i am a agent manager status change info '});
            setTimeout(function(){
                done();
            }, 1000);
        });
    })
})




