var mod = require("../mod");
var copy = require("../copy");

/************
	SFN
*************/
var sfn = function(){
	var arg, fn = function(){
		return fn.main.apply(fn, arguments);
	};

	copy(mod, fn, true);

	fn.main = function(){};

	// put these before the assign, so you can override bases
	fn.base = sfn;
	fn.Base = sfn;
	
	if(arguments.length){
		for(var i=0; i<arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "object")
				fn.assign(arg);
			else if (typeof arg === "function")
				fn.main = arg;
		}
	}

	
	// fn.init && fn.init();

	return fn;
};


module.exports = sfn;