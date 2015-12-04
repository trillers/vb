var util = require('util');
var EventEmitter = require('events').EventEmitter;
var messageDefinitions = require('./MessageDefinitions');
var brokerHelper = require('./BrokerHelper');

var AgentManager = function(producerChannel, consumerChannel){
    EventEmitter.call(this);
    this.producerChannel = producerChannel;
    this.consumerChannel = consumerChannel;
};

util.inherits(AgentManager, EventEmitter);

/**
 * agent manager broker private init
 */
AgentManager.prototype._init = function(){
    var self = this;
    return  self;
    //TODO
}

/**
 * agent manager broker public init
 */
AgentManager.prototype.init = function(id){
    var self = this;
    self.listenInfoRequest(id);
    self.listenCommand(id);
    return  self;
    //TODO
}


/**
 * send agent manager heartbeat
 * @param heartbeat info
 **/
AgentManager.prototype.heartbeat = function(beatInfo){
    var type = typeof beatInfo;
    if (type !== 'object') {
        return console.warn('invalid heart beat info');
    }
    var conf = messageDefinitions.am.heartbeat;
    brokerHelper.produce.call(this, this.producerChannel, conf, beatInfo);
};

/**
 * send agent manager status info
 * @param status info
 **/
AgentManager.prototype.infoResponse = function(info){
    var type = typeof info;
    if (type !== 'object') {
        return console.warn('invalid status info');
    }
    var conf = messageDefinitions.am.infoResponse;
    brokerHelper.produce.call(this, this.producerChannel, conf, info);
};

/**
 * agent manager status change
 * @param change info
 **/
AgentManager.prototype.statusChange = function(changeInfo){
    var type = typeof changeInfo;
    if (type !== 'object') {
        return console.warn('invalid change info');
    }
    var conf = messageDefinitions.am.statusChange;
    brokerHelper.produce.call(this, this.producerChannel, conf, changeInfo);
};

/**
 * on node manager info request
 * @param handler
 * @param id
 **/
AgentManager.prototype.onInfoRequest = function(handler, id){
    this.on(messageDefinitions.node.infoRequest.eventName + id, handler);
};

/**
 * listening node manager info request queue
 * @param id
 **/
AgentManager.prototype.listenInfoRequest = function(id){
    var conf = messageDefinitions.node.infoRequest;
    brokerHelper.consume.call(this, this.consumerChannel, conf, id);
};

/**
 * on node manager command
 * @param handler
 * @param id
 **/
AgentManager.prototype.onCommand = function(handler, id){
    this.on(messageDefinitions.node.command.eventName + id, handler);
};

/**
 * listening node manager command queue
 * @param id
 **/
AgentManager.prototype.listenCommand = function(id){
    var conf = messageDefinitions.node.command;
    brokerHelper.consume.call(this, this.consumerChannel, conf, id);
};

module.exports = AgentManager;
