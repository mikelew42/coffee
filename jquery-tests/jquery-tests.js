var $ = require("jquery");
var is = require("../is");
$.fn.view = function(o){

	var $self = this, $sub;

	for (var i in o){
		$sub = $("<div>").addClass(i);

		if (is.val(o[i]))
			$sub.html(o[i]);
		else if (o[i] instanceof $)
			$sub.append(o[i]);
		else if (is.obj(o[i]))
			$sub.view(o[i]);

		$self.append($sub);
		$self[i] = $sub;
		$sub.$parent = $self;
	}

	return $self;
};