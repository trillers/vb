var BrokerFactory = require('../../index');
var rabbitmq = require('base-settings').rabbitmq;
var assert = require('chai').assert;
var url = 'amqp://' +rabbitmq.username + ':' + rabbitmq.password + '@' + rabbitmq.host + ':' + rabbitmq.port + '/' + rabbitmq.vhost;
var open = require('amqplib').connect(url);

describe('node manager test', function(){
    var brokerPromise = BrokerFactory.create(open, {nm: true, am: true});

    it('agent manager info request', function(done){
        brokerPromise.then(function(broker){
            var agentManagerBroker = broker.getAgentManager();
            var nodeManagerBroker = broker.getNodeManager();
            agentManagerBroker.init('am1');
            agentManagerBroker.init('am2');

            agentManagerBroker.onInfoRequest(function(err, req){
                console.log(req);
            }, 'am1');
            agentManagerBroker.onInfoRequest(function(err, req){
                console.log(req);
            }, 'am2');
            nodeManagerBroker.infoRequest({req: 'i am a am1 info request'}, 'am1');
            nodeManagerBroker.infoRequest({req: 'i am a am2 info request'}, 'am2');
            setTimeout(function(){
                done();
            }, 1000);
        });
    })

    it('send command to agent mananger', function(done){
        brokerPromise.then(function(broker){
            var agentManagerBroker = broker.getAgentManager();
            var nodeManagerBroker = broker.getNodeManager();
            agentManagerBroker.init('am1');
            agentManagerBroker.init('am2');

            agentManagerBroker.onCommand(function(err, command){
                console.log(command);
            }, 'am1');
            agentManagerBroker.onCommand(function(err, command){
                console.log(command);
            }, 'am2');
            nodeManagerBroker.command({command: 'i am a am1 command'}, 'am1');
            nodeManagerBroker.command({command: 'i am a am2 command'}, 'am2');
            setTimeout(function(){
                done();
            }, 1000);
        });
    })

})



