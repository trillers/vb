var BotBroker = require('./BotBroker');
var AgentBroker = require('./AgentBroker');
var AgentManagerBroker = require('./AgentManagerBroker');
var NodeManagerBroker = require('./NodeManagerBroker');

var Broker = function(conn, producerChannel, consumerChannel){
    this.conn = conn;
    this.producerChannel = producerChannel;
    this.consumerChannel = consumerChannel;
};
Broker.prototype.init = function(opts) {
    var self = this;
    var promise = Promise.resolve();
    if (opts && opts.am) {
        this.agentManager = new AgentManagerBroker(this.producerChannel, this.consumerChannel);
    }
    if (opts && opts.nm) {
        this.nodeManager = new NodeManagerBroker(this.producerChannel, this.consumerChannel);
    }
    if (opts && opts.agent) {
        this.agent = new AgentBroker(this.producerChannel, this.consumerChannel);
    }
    if (opts && opts.bot) {
        this.bot = new BotBroker(this.producerChannel, this.consumerChannel);
    }

    return promise.then(function () {
        return self.bot && self.bot._init() || '';
    })
        .then(function () {
            return self.nodeManager && self.nodeManager._init() || '';
        })
        .then(function () {
            return self.agentManager && self.agentManager._init() || '';
        })
        .then(function () {
            return self.agent && self.agent._init() || ''
        })
        .then(function () {
            return self;
        });
}

Broker.prototype.getBot = function(){
    return this.bot;
};
Broker.prototype.getAgent = function(){
    return this.agent;
};
Broker.prototype.getAgentManager = function(){
    return this.agentManager;
};
Broker.prototype.getNodeManager = function(){
    return this.nodeManager;
};

Broker.prototype.close = function(){
    return this.conn.close();
}

module.exports = Broker;