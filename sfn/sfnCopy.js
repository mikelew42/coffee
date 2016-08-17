var copy = require("../Copy");
var sfnBase = require("./sfnBase");

var sfnCopy = function(o){
	var c = copy(this, sfnBase(), true);
	c.set.apply(c, arguments);
	if (!o || (o && !o.factory)) delete c.factory; // do this after c.set.  .factory has no effect until you try to invoke the new copy
	if (c.init) c.init();
	return c;
};

module.exports = sfnCopy;