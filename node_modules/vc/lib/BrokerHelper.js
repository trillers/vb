var helper = {}

//helper.broadcast = function(ch, conf, beatInfo){
//    ch.assertExchange(conf.exchange, conf.exchangeModel, conf.exchangeOptions);
//
//    ch.publish(conf.exchange, conf.exchangeKey, new Buffer(JSON.stringify(beatInfo)));
//}
//
//helper.onBroadcast = function(ch, conf){
//    var self = this;
//    ch.assertExchange(conf.exchange, conf.exchangeModel, conf.exchangeOptions);
//
//    var ok = ch.assertQueue('', conf.consumerQueueOptions);
//    return ok.then(function(q) {
//        ch.bindQueue(q.queue, conf.exchange, conf.exchangeKey);
//        ch.consume(q.queue, function (msg) {
//            var beatInfo = JSON.parse(msg.content.toString());
//            self.emit(conf.eventName, null, beatInfo);
//        }, conf.consumeOptions);
//    });
//}

/**
 * mq produce
 * @params ch
 * @params conf
 * @params msg
 * @params id client identification
 */
helper.produce = function(ch, conf, msg, id){
    var queueName = conf.queueName + (id || '');
    ch.assertQueue(queueName, conf.queueOptions)
        .then(function(){
            ch.sendToQueue(queueName, new Buffer(JSON.stringify(msg)), conf.produceOptions);
        });
}

/**
 * mq consume
 * @params ch
 * @params conf
 * @params id client identification
 */
helper.consume = function(ch, conf, id){
    var self = this;
    var queueName = conf.queueName + (id || '');
    var eventName = conf.eventName + (id || '');
    ch.assertQueue(queueName, conf.queueOptions)
        .then(function(){
            ch.prefetch(1);
            ch.consume(queueName, function(msg) {
                self.emit(eventName, null, JSON.parse(msg.content.toString()));
                if(!conf.consumeOptions.noAck){
                    ch.ack(msg);
                }
            }, conf.consumeOptions);
        });
}

module.exports = helper;