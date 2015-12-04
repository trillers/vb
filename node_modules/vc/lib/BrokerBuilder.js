var Broker = require('./Broker');

var BrokerBuilder = function(){
    this.conn = null;
    this.producerChannel = null;
    this.consumerChannel = null;
};

BrokerBuilder.create = function(){
    return new BrokerBuilder();
};

BrokerBuilder.prototype.setConn = function(conn){
    this.conn = conn;
    return this;
};

BrokerBuilder.prototype.setProducerChannel = function(ch){
    this.producerChannel = ch;
    return this;
};

BrokerBuilder.prototype.setConsumerChannel = function(ch){
    this.consumerChannel = ch;
    return this;
};

BrokerBuilder.prototype.build = function(){
    return new Broker(this.conn, this.producerChannel, this.consumerChannel);
};

module.exports = BrokerBuilder;