var is = require("../is");
var copy = require("../copy");
var sfnBase = require("./sfnBase");
var sfnCopy = require("./sfnCopy");

// this is a version of sfn that does not use set, and is used to define set...
var ssfn = function(){
	var arg, fn = sfnBase();

	fn.assign = function(obj){
		return Object.assign(this, obj);
	};

	fn.copy = sfnCopy;

	fn.set = function(){
		if(arguments.length){
			for(var i=0; i<arguments.length; i++){
				arg = arguments[i];
				if (typeof arg === "object")
					this.assign(arg);
				else if (typeof arg === "function")
					this.invoke = arg;
			}
		}
	};

	fn.set.apply(fn, arguments);
	
	fn.init && fn.init();

	return fn;
};

module.exports = ssfn;