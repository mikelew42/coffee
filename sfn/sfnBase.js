var is = require("../is");

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
		else if (sfn.assign)
			return sfn.assign.apply(sfn, arguments);
	};

	return sfn;
};

module.exports = sfnBase;