var bot = module.exports = {
    //message broker
    broker: null,
    //create broker
    init: function(bot, done){
        require('./init').create(bot, done);
    },
    //event binding
    start: function(done){
        require('./init').bindEvents(bot, done);
        
    }
};

