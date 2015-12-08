var util = require('util');
var EventEmitter = require('events').EventEmitter;
var messageDefinitions = require('./MessageDefinitions');
var brokerHelper = require('./BrokerHelper');

var Agent = function(producerChannel, consumerChannel){
    EventEmitter.call(this);
    this.producerChannel = producerChannel;
    this.consumerChannel = consumerChannel;
};

util.inherits(Agent, EventEmitter);

/**
 * agent broker private init
 */
Agent.prototype._init = function(){
    var self = this;
    return self;
    //TODO
}

/**
 * agent broker public init
 * @param id
 */
Agent.prototype.init = function(id){
    var self = this;
    self.listenActionOut(id);
    return self;
    //TODO
}

/**
 * send agent heartbeat
 * @param heartbeat info
 **/
Agent.prototype.heartbeat = function(beatInfo){
    var type = typeof beatInfo;
    if (type !== 'object') {
        return console.warn('invalid heart beat info');
    }
    var conf = messageDefinitions.agent.heartbeat;
    brokerHelper.produce.call(this, this.producerChannel, conf, beatInfo);
};

/**
 * send agent status change info to node manager
 * @param change info
 **/
Agent.prototype.agentStatusChange = function(changeInfo){
    var type = typeof changeInfo;
    if (type !== 'object') {
        return console.warn('invalid changeInfo');
    }
    var conf = messageDefinitions.agent.agentStatusChange;
    brokerHelper.produce.call(this, this.producerChannel, conf, changeInfo);
};

/**
 * send agent status change info to bot
 * @param change info
 **/
Agent.prototype.botStatusChange = function(changeInfo){
    var type = typeof changeInfo;
    if (type !== 'object') {
        return console.warn('invalid changeInfo');
    }
    var conf = messageDefinitions.agent.botStatusChange;
    brokerHelper.produce.call(this, this.producerChannel, conf, changeInfo);
};

/**
 * action from agent to bot
 * @param action
 **/
Agent.prototype.actionIn = function(action){
    var type = typeof action;
    if (type !== 'object') {
        return console.warn('invalid action');
    }
    var conf = messageDefinitions.agent.actionIn;
    brokerHelper.produce.call(this, this.producerChannel, conf, action);
};

/**
 * action feedback to bot
 * @param feedback
 **/
Agent.prototype.actionFeedback = function(feedback){
    var type = typeof feedback;
    if (type !== 'object') {
        return console.warn('invalid feedback');
    }
    var conf = messageDefinitions.agent.actionFeedback;
    brokerHelper.produce.call(this, this.producerChannel, conf, feedback);
};

/**
 * on bot action
 * @param handler
 * @param id
 **/
Agent.prototype.onActionOut = function(handler, id){
    this.on(messageDefinitions.bot.actionOut.eventName + id, handler);
};

/**
 * listening bot action queue
 * @param id
 **/
Agent.prototype.listenActionOut = function(id){
    var conf = messageDefinitions.bot.actionOut;
    brokerHelper.consume.call(this, this.consumerChannel, conf, id);
};

/**
 * acknowledge msg has handled
 * @param msg
 */
Agent.prototype.finish = function(msg){
    brokerHelper.acknowledge(this.consumerChannel, msg);
}

module.exports = Agent;
