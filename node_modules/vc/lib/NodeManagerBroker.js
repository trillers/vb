var util = require('util');
var EventEmitter = require('events').EventEmitter;
var messageDefinitions = require('./MessageDefinitions');
var brokerHelper = require('./BrokerHelper');

var NodeManager = function(producerChannel, consumerChannel){
    EventEmitter.call(this);
    this.producerChannel = producerChannel;
    this.consumerChannel = consumerChannel;
};

util.inherits(NodeManager, EventEmitter);

/**
 * bot broker private init
 */
NodeManager.prototype._init = function(){
    var self = this;
    self.listenAgentManagerHeartBeat();
    self.listenInfoResponse();
    self.listenAgentManagerStatusChange();
    self.listenAgentStatusChange();
    self.listenAgentHeartBeat();
    self.listenCommand();
    return self;
    //TODO
}

/**
 * bot broker public init
 */
NodeManager.prototype.init = function(){
    var self = this;
    return self;
    //TODO
}

/**
 * on agent heartbeat
 * @param handler
 **/
NodeManager.prototype.onAgentHeartbeat = function(handler){
    this.on(messageDefinitions.agent.heartbeat.eventName, handler);
};

/**
 * listening agent heartbeat queue
 **/
NodeManager.prototype.listenAgentHeartBeat = function(){
    var conf = messageDefinitions.agent.heartbeat;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * on agent manager heartbeat
 * @param handler
 **/
NodeManager.prototype.onAgentManagerHeartbeat = function(handler){
    this.on(messageDefinitions.am.heartbeat.eventName, handler);
};

/**
 * listening agent manager heartbeat queue
 **/
NodeManager.prototype.listenAgentManagerHeartBeat = function(){
    var conf = messageDefinitions.am.heartbeat;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * listening agent manager info queue
 **/
NodeManager.prototype.listenInfoResponse = function(){
    var conf = messageDefinitions.am.infoResponse;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};


/**
 * on agent manager info
 * @param handler
 **/
NodeManager.prototype.onInfoResponse = function(handler){
    this.on(messageDefinitions.am.infoResponse.eventName, handler);
};

/**
 * on agent manager status change
 * @param handler
 **/
NodeManager.prototype.onAgentManagerStatusChange = function(handler){
    this.on(messageDefinitions.am.statusChange.eventName, handler);
};

/**
 * listening agent manager status change queue
 **/
NodeManager.prototype.listenAgentManagerStatusChange = function(){
    var conf = messageDefinitions.am.statusChange;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * on agent status change
 * @param handler
 **/
NodeManager.prototype.onAgentStatusChange = function(handler){
    this.on(messageDefinitions.agent.agentStatusChange.eventName, handler);
};

/**
 * listening agent status change queue
 **/
NodeManager.prototype.listenAgentStatusChange = function(){
    var conf = messageDefinitions.agent.agentStatusChange;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * request agent manager info
 **/
NodeManager.prototype.infoRequest = function(req, id){
    var conf = messageDefinitions.node.infoRequest;
    brokerHelper.produce.call(this, this.consumerChannel, conf, req, id);
};

/**
 * send command to agent manager
 **/
NodeManager.prototype.command = function(command, id){
    var conf = messageDefinitions.node.command;
    brokerHelper.produce.call(this, this.consumerChannel, conf, command, id);
};

/**
 * on bot command
 * @param handler
 **/
NodeManager.prototype.onCommand = function(handler){
    this.on(messageDefinitions.bot.command.eventName, handler);
};

/**
 * listening bot command queue
 **/
NodeManager.prototype.listenCommand = function(){
    var conf = messageDefinitions.bot.command;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * acknowledge msg has handled
 * @param msg
 */
NodeManager.prototype.finish = function(msg){
    brokerHelper.acknowledge(this.consumerChannel, msg);
}

module.exports = NodeManager;
