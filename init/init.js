var then = require("../then");
var sfn = require("../sfn");

var init = sfn({
	factory: true,
	then: then(),
	adopt: true,
	invoke: function(){
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
				if (!init.then[i]){
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