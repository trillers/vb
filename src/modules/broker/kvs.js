var redis = require('../../../src/app/redis');
var logger = require('../../../src/app/logging').logger;
var Promise = require('bluebird');
var cbUtil = require('../../../src/framework/callback');

var agentIdToCookiesKey = function(agentId){
    return 'ag:id->c:' + agentId;
};
var agentSetKey = function(nodeId){
    return 'ag:set';
};

var kvs ={
    getAllAgents: function(callback){
        var key = agentSetKey();
        redis.smembers(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to load all agents' + ': ' + err,
                'Succeed to load all agents');
            cbUtil.handleSingleValue(callback, err, result);
        })

    },
    getCookiesByAgentId: function(agentId, callback){
        var key = agentIdToCookiesKey(agentId);
        redis.hgetall(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to get cookies by agent id ' + agentId + ': ' + err,
                'Succeed to get cookies by id ' + agentId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    },
    saveCookiesByAgentId: function(agentId, cookies, callback){
        var key = agentIdToCookiesKey(agentId);
        var arr = []
        cookies.map(function(i){
            arr.push(JSON.stringify(i));
        });
        redis.hmset(key, arr, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to save cookies err: ' + err,
                'Succeed to save cookies' );
            cbUtil.handleSingleValue(callback, err, result);
        });
    },
    delCookiesByAgentId: function(agentId, callback){
        var key = agentIdToCookiesKey(agentId);
        redis.del(key, function(err, result){
            cbUtil.logCallback(
                err,
                'Fail to del cookies by agent id ' + agentId + ': ' + err,
                'Succeed to del cookies by agent id ' + agentId);
            cbUtil.handleSingleValue(callback, err, result);
        });
    }
};

kvs = Promise.promisifyAll(kvs);

module.exports = kvs;