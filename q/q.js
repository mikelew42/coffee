var is = require("../is");
var coll = require("../coll");

var q = coll({
	factory: true,
	invoke: "append",
	exec: function(){
		var args = arguments;
		this.eachItem(function(cbItem){
			cbItem.value.apply(cbItem.ctx || this.$parent || this, args);
		});
		return this.$parent || this;
	}
});

module.exports = q;