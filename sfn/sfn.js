var mod = require("../mod");
var copy = require("../copy");
var is = require("../is");
var sfnBase = require("./sfnBase");
var sfnCopy = require("./sfnCopy");
/************
	SFN
*************/

// all "modules" should have .copy, .set, and .assign
// could copy actually use set?

var sfn = function(){
	var arg, fn = sfnBase();

	// copy mod.assign, mod.copy, and mod.set to the fn
	copy(mod, fn, true);

	// override copy to use sfnBase (see sfnCopy.js)
	fn.copy = sfnCopy;

	// when present, set.fn will be called when we pass a fn to the sfn.set
	fn.set.fn = function(sfn, newInvokeFn){
		sfn.invoke = newInvokeFn;
	};

	fn.set.apply(fn, arguments);

	fn.init && fn.init();

	return fn;
};

module.exports = sfn;

