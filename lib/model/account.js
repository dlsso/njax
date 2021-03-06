'use strict';
var fs = require('fs');
var async = require('async');
var passport = require('passport');
var passportLocalMongoose = require('passport-local-mongoose');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(app){
    
    var accountSchema = require('./_gen/account_gen')(app);
    
    /*
    Custom Code goes here
    */


    accountSchema.plugin(passportLocalMongoose, { usernameField:'email', usernameLowerCase:true});


    accountSchema.virtual('authed_apps').get(function(){
        var _this = this;
        return {
            get:function(callback){
                //Load AuthTokens populate Applications
                app.model.AccessToken.find(
                    {
                        account: this._id//,
                        //TODO: Add expirationDate check
                    })
                    .populate('application')
                    .exec(function(err, access_tokens){
                        if(err) return callback(err);
                        var applications = [];
                        for(var i in access_tokens){
                            applications.push(access_tokens[i].application);
                        }
                        return callback(null, applications)
                    });
            }
        }

    });



    accountSchema._passport = passport;
    accountSchema._LocalStrategy = LocalStrategy;


	if (!accountSchema.options.toObject) accountSchema.options.toObject = {};
	accountSchema.options.toObject.transform = function (doc, ret, options) {
		ret.uri = doc.uri;
		var port_str = '';
		delete(ret.hash);
		delete(ret.salt);
		if(!app.njax.config.hide_port){
			port_str = ':' + app.njax.config.port;
		}
		ret.url = app.njax.config.domain + port_str + doc.uri;

		ret.api_url = app.njax.config.core.api.host  + doc.uri;

	}


    /*
     * END CUSTOM CODE
     *
     */


    return accountSchema;

}