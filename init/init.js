var then = require("../then");
var sfn = require("../sfn");

var init = sfn({
	__id: "init",
	factory: true,
	then: then(),
	adopt: true,
	main: function(){
		if (!arguments.length){
			this.then.exec();
		} else {
			this.set.apply(this.set, arguments);
		}
	},
	set: {
		fn: function(init, fn){
			init.then(fn);
		},
		obj: function(init, obj){
			var args = {};
			for (var i in obj){
				if (i[0] === "$"){
					init[i] = obj[i];
				} else if (!init.then[i]){
					// add new cb
					args[i] = obj[i];
					init.then(args);
				} else {
					// override existing cb, leaving sub cbs in place
					init.then[i].value = obj[i];
				}
			}
		}
	}
});

module.exports = init;