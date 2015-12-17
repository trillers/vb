var basePath = process.cwd() + "/src/modules/broker/";
var kvs = require(basePath + 'kvs.js');
var assert= require('chai').assert;

describe('kvs', function(){
    it('#saveCookiesByAgentId', function(done){
        var mock = {
            AgentId: 'agent1'
        };
        var cookies = [{foo: 'bar'}, {foo1: 'bar1'}];
        kvs.saveCookiesByAgentId(mock.AgentId, cookies, function(err, result){
            assert.isNull(err);
            kvs.getCookiesExpire(mock.AgentId, function(err, result){
                assert.isNull(err);
                assert.equal(result, 180);
                done();
            })
        })
    });
    it('#getCookiesByAgentId', function(done){
        var mock = {
            AgentId: 'agent1'
        };
        kvs.getCookiesByAgentId(mock.AgentId, function(err, result){
            assert.isNull(err);
            console.log(result);
            done();
        })
    })
});
