var util = require('util');
var EventEmitter = require('events').EventEmitter;
var messageDefinitions = require('./MessageDefinitions');
var brokerHelper = require('./BrokerHelper');

var Bot = function(producerChannel, consumerChannel){
    EventEmitter.call(this);
    this.producerChannel = producerChannel;
    this.consumerChannel = consumerChannel;
};

util.inherits(Bot, EventEmitter);

/**
 * bot broker private init
 */
Bot.prototype._init = function(){
    var self = this;
    self.listenAgentStatusChange();
    self.listenActionIn();
    self.listenActionFeedback();
    //TODO
}

/**
 * on agent status change
 * @param handler
 **/
Bot.prototype.onAgentStatusChange = function(handler){
    this.on(messageDefinitions.agent.botStatusChange.eventName, handler);
};

/**
 * listening agent status change queue
 **/
Bot.prototype.listenAgentStatusChange = function(){
    var conf = messageDefinitions.agent.botStatusChange;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * on agent action
 * @param handler
 **/
Bot.prototype.onActionIn = function(handler){
    this.on(messageDefinitions.agent.actionIn.eventName, handler);
};

/**
 * listening agent action queue
 **/
Bot.prototype.listenActionIn = function(){
    var conf = messageDefinitions.agent.actionIn;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * on agent action feedback
 * @param handler
 **/
Bot.prototype.onActionFeedback = function(handler){
    this.on(messageDefinitions.agent.actionFeedback.eventName, handler);
};

/**
 * listening agent action feedback queue
 **/
Bot.prototype.listenActionFeedback = function(){
    var conf = messageDefinitions.agent.actionFeedback;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * send command to node manager
 **/
Bot.prototype.command = function(command){
    var conf = messageDefinitions.bot.command;
    brokerHelper.produce.call(this, this.consumerChannel, conf, command);
};

/**
 * send action to agent
 * @param action
 * @param id
 **/
Bot.prototype.actionOut = function(action, id){
    var conf = messageDefinitions.bot.actionOut;
    brokerHelper.produce.call(this, this.consumerChannel, conf, action, id);
};

module.exports = Bot;
