var mod = require("../mod");
var copy = require("../copy");
var is = require("../is");

/************
	SFN
*************/
var sfnBase = function(){
	var sfn = function(){
		if (sfn.factory)
			return sfn.copy.apply(sfn, arguments);
		else if (is.str(sfn.invoke))
			return sfn[sfn.invoke].apply(sfn, arguments);
		else if (is.fn(sfn.invoke))
			return sfn.invoke.apply(sfn, arguments);
		else
			return sfn.set.apply(sfn, arguments);
	};

	return sfn;
};

var sfn = function(){
	var arg, fn = sfnBase();

	copy(mod, fn, true);

	fn.copy = function(o){
		var _sfnBase = sfnBase();
		var c = copy(this, _sfnBase, true);
		c.set.apply(c, arguments);
		if (o && !o.factory) delete c.factory; // do this after c.set.  .factory has no effect until you try to invoke the new copy
		if (c.init) c.init();
		return c;
	};

	fn.setFn = function(newMainFn){
		this.invoke = newMainFn;
	};

	fn.set.apply(fn, arguments);

	fn.init && fn.init();

	// put these before the assign, so you can override bases
	// fn.base = sfn;
	// fn.Base = sfn;
	
	// if(arguments.length){
	// 	for(var i=0; i<arguments.length; i++){
	// 		arg = arguments[i];
	// 		if (typeof arg === "object")
	// 			fn.assign(arg);
	// 		else if (typeof arg === "function")
	// 			fn.main = arg;
	// 	}
	// }

	
	// fn.init && fn.init();

	return fn;
};


module.exports = sfn;