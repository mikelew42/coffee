var is = require("../is");

var sfnBase = function(){
	var sfn = function(){
		if (sfn.factory)
			return sfn.copy.apply(sfn, arguments);
		else if (is.str(sfn.main))
			return sfn[sfn.main].apply(sfn, arguments);
		else if (is.fn(sfn.main))
			return sfn.main.apply(sfn, arguments);
		else if (sfn.getSet)
			return sfn.getSet.apply(sfn, arguments);
		else if (sfn.assign)
			return sfn.assign.apply(sfn, arguments);
	};

	return sfn;
};

module.exports = sfnBase;