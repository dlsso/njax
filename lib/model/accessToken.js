'use strict';
var fs = require('fs');
var async = require('async');
module.exports = function(app){
    
    var accesstokenSchema  = require('./_gen/accessToken_gen')(app);
    
    /*
    Custom Code goes here
    */

    return  accesstokenSchema;
}