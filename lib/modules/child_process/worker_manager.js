var cp = require('child_process');
var async = require('async');
var _ = require('underscore');
module.exports = function(app){

    var NJaxCPHandler = function(options){
        this.events = {};
        _.extend(this, options);


        return this;
    }
    NJaxCPHandler.prototype.start = function(){
        this.process = cp.fork(this.script);
        this.process.on('message', this.onMessage);
    }
    NJaxCPHandler.prototype.onMessage = function(m){
        //Look for events
        var data = JSON.parse(m);
        var event = null;
        if(data._event){
            //Trigger some events
            event = data._event;
        }else{
            event = 'message';
        }
        this.trigger(event, data);
    }
    NJaxCPHandler.prototype.trigger = function(event, callback){
        if(!this.events[event]){
            return false;
        }
        for(var i in this.events[event]){
            this.events[event][i](event, data, this);
        }
    }
    NJaxCPHandler.prototype.on = function(event, callback){
        if(!this.events[event]){
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    NJaxCPHandler.prototype.send = function(command, data){
        if(!data){
            data = {};
        }
        data._command = command;
        this.process.send(data);
    }



    var njax_cp = {
        spawn:function(script, callback){
            var child = new NJaxCPHandler({ script:script });
            child.on('init', callback);
            child.start();
            return child;
        }
    }
    return njax_cp;
}