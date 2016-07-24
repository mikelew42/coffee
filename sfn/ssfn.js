var is = require("../is");
var copy = require("../copy");

var sfnBase = function(){
	var sfn = function(){
		if (sfn.factory)
			return sfn.copy.apply(sfn, arguments);
		else if (is.str(sfn.invoke))
			return sfn[sfn.invoke].apply(sfn, arguments);
		else if (is.fn(sfn.invoke))
			return sfn.invoke.apply(sfn, arguments);
		else if (sfn.set)
			return sfn.set.apply(sfn, arguments);
	};

	return sfn;
};

// this is a version of sfn that does not use set, and is used to define set...
var ssfn = function(){
	var arg, fn = sfnBase();

	fn.assign = function(obj){
		return Object.assign(this, obj);
	};

	fn.copy = function(o){
		var _sfnBase = sfnBase();
		var c = copy(this, _sfnBase, true);
		c.assign.apply(c, arguments);
		if (o && !o.factory) delete c.factory; // do this after c.set.  .factory has no effect until you try to invoke the new copy
		if (c.init) c.init();
		return c;
	};

	if(arguments.length){
		for(var i=0; i<arguments.length; i++){
			arg = arguments[i];
			if (typeof arg === "object")
				fn.assign(arg);
			else if (typeof arg === "function")
				fn.invoke = arg;
		}
	}

	
	fn.init && fn.init();

	return fn;
};

module.exports = ssfn;