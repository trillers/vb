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
    self.listenClientAction();
    self.listenClientCommand();
    self.listenCommandFeedback();
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

Bot.prototype.listenCommandFeedback = function(){
    var conf = messageDefinitions.agent.commandFeedback;
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
 * on client action
 * @param handler
 **/
Bot.prototype.onClientAction = function(handler){
    this.on(messageDefinitions.client.actionOut.eventName, handler);
};

/**
 * listening client action queue
 **/
Bot.prototype.listenClientAction = function(){
    var conf = messageDefinitions.client.actionOut;
    brokerHelper.consume.call(this, this.consumerChannel, conf);
};

/**
 * on client command
 * @param handler
 **/
Bot.prototype.onClientCommand = function(handler){
    this.on(messageDefinitions.client.command.eventName, handler);
};

/**
 * listening client command queue
 **/
Bot.prototype.listenClientCommand = function(){
    var conf = messageDefinitions.client.command;
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

/**
 * send action to vk
 * @param action
 * @param id
 **/
Bot.prototype.clientActionIn = function(action, id){
    var conf = messageDefinitions.bot.clientActionIn;
    brokerHelper.produce.call(this, this.consumerChannel, conf, action, id);
};

/**
 * send action to vk
 * @param action
 * @param id
 **/
Bot.prototype.clientActionFeedback = function(action, id){
    var conf = messageDefinitions.bot.clientActionFeedback;
    brokerHelper.produce.call(this, this.consumerChannel, conf, action, id);
};

Bot.prototype.finish = function(msg){
    brokerHelper.acknowledge(this.consumerChannel, msg);
}

Bot.prototype.onCommandFeedback = function(handler){
    this.on(messageDefinitions.agent.commandFeedback.eventName, handler);
};

/**
 * get the msg count of action out queue
 * @param id :agent id
 */
Bot.prototype.getActionOutMsgCount = function(id){
    var queueName = messageDefinitions.bot.actionOut.queueName + id;
    return this.producerChannel.assertQueue(queueName).then(function(data){
        return data.messageCount;
    });
}
module.exports = Bot;
